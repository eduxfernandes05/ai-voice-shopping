import { useState, useEffect, useRef } from 'react'
import { Microphone, Stop, SpeakerHigh, Phone, PhoneDisconnect } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface VoiceAssistantProps {
  onRecommendation?: (modalityNumbers: number[]) => void
  onRemoveRecommendation?: (modalityNumbers: number[]) => void
}

// Azure OpenAI Realtime API configuration
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_REALTIME_ENDPOINT
const API_KEY = import.meta.env.VITE_AZURE_REALTIME_API_KEY
const DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_REALTIME_DEPLOYMENT || 'gpt-realtime'

if (!AZURE_ENDPOINT || !API_KEY) {
  console.error('Missing Azure OpenAI credentials. Please set VITE_AZURE_REALTIME_ENDPOINT and VITE_AZURE_REALTIME_API_KEY in your .env file')
}

export function VoiceAssistant({ onRecommendation, onRemoveRecommendation }: VoiceAssistantProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', text: string}>>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('')
  
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const audioQueueRef = useRef<AudioBuffer[]>([])
  const isPlayingRef = useRef(false)
  const nextStartTimeRef = useRef(0)
  const currentSourcesRef = useRef<AudioBufferSourceNode[]>([])
  const currentAssistantTextRef = useRef('')
  const currentResponseIdRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup ao desmontar
      disconnectRealtime()
    }
  }, [])

  const stopAllAudio = () => {
    // Para todos os áudios em reprodução
    currentSourcesRef.current.forEach(source => {
      try {
        source.stop()
      } catch (e) {
        // Ignore se já parou
      }
    })
    currentSourcesRef.current = []
    
    // Limpa a fila
    audioQueueRef.current = []
    isPlayingRef.current = false
    
    // Reseta o timing
    if (audioContextRef.current) {
      nextStartTimeRef.current = audioContextRef.current.currentTime
    }
  }

  const connectRealtime = async () => {
    setIsConnecting(true)
    setStatusMessage('Connecting to voice assistant...')
    setConversation([])
    setCurrentUserMessage('')
    setCurrentAssistantMessage('')
    
    try {
      // Obter microfone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      mediaStreamRef.current = stream
      
      // Criar AudioContext
      audioContextRef.current = new AudioContext({ sampleRate: 24000 })
      
      // GA model format: wss://endpoint/openai/v1/realtime?model=deployment-name&api-key=key
      // Sem api-version parameter para modelos GA
      const wsUrl = `wss://${AZURE_ENDPOINT.replace('https://', '')}/openai/v1/realtime?model=${DEPLOYMENT_NAME}&api-key=${API_KEY}`
      
      console.log('Conectando ao WebSocket:', wsUrl.replace(API_KEY, '***'))
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws
      
      ws.onopen = () => {
        console.log('WebSocket conectado')
        
        // Configurar sessão (formato GA model)
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            type: 'realtime',
            instructions: `You are a professional AI assistant for Nexus Platform, specializing in helping clients choose the right professional services.

IMPORTANT: The client should choose ONE OR MORE of the following 7 services:

SERVICE 1: Strategic Business Consulting ($299/month)
   - Expert business transformation guidance
   - Market analysis and competitive positioning

SERVICE 2: Technology Advisory Services ($399/month)
   - Technical consulting for digital transformation
   - Cloud migration and tech stack optimization

SERVICE 3: Custom Web Development ($499/month)
   - Full-stack web applications
   - Design, development, and deployment

SERVICE 4: Mobile App Development ($599/month)
   - Native and cross-platform apps
   - iOS and Android with cloud integration

SERVICE 5: UX/UI Design Services ($349/month)
   - User experience research and interface design
   - Prototyping for web and mobile

SERVICE 6: Premium Support Package ($199/month)
   - 24/7 dedicated support
   - Priority bug fixes and monthly consultations

SERVICE 7: Team Training & Workshops ($449/month)
   - Customized training programs
   - Latest technologies and methodologies

**Your mission:**
1. Ask about their business needs, goals, and current challenges
2. Recommend SPECIFIC services (by number) that best fit their needs
3. Explain WHY each service is suitable
4. If they say they no longer need a service, clearly state "removing service X"
5. Speak naturally and professionally in English
6. Be brief and direct, don't ramble

Examples: 
- Add: "I recommend service 1 because you need business strategy guidance."
- Remove: "Understood, removing service 4" or "You don't need service 4"`,
            output_modalities: ['audio'],
            audio: {
              input: {
                transcription: {
                  model: 'whisper-1'
                },
                format: {
                  type: 'audio/pcm',
                  rate: 24000
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 500,
                  create_response: true
                }
              },
              output: {
                voice: 'alloy',
                format: {
                  type: 'audio/pcm',
                  rate: 24000
                }
              }
            }
          }
        }))
        
        setIsConnected(true)
        setStatusMessage('Connected! You can start speaking.')
        startAudioCapture()
      }
      
      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Evento recebido:', data.type)
          
          // Usuário começou a falar - PARA TUDO
          if (data.type === 'input_audio_buffer.speech_started') {
            console.log('🔴 Usuário começou a falar - parando áudio')
            stopAllAudio()
            setCurrentAssistantMessage('')
            currentAssistantTextRef.current = ''
            setIsUserSpeaking(true)
            setCurrentUserMessage('Speaking...')
          }
          
          // Usuário parou de falar
          if (data.type === 'input_audio_buffer.speech_stopped') {
            console.log('🟢 Usuário parou de falar')
            setCurrentUserMessage('Processing...')
          }
          
          // Transcrição do input do usuário
          if (data.type === 'conversation.item.input_audio_transcription.completed') {
            console.log('Transcrição input completa:', data.transcript)
            setIsUserSpeaking(false)
            setConversation(prev => [...prev, { role: 'user', text: data.transcript }])
            setCurrentUserMessage('')
          }
          
          // Nova resposta iniciada
          if (data.type === 'response.created') {
            currentResponseIdRef.current = data.response.id
            currentAssistantTextRef.current = ''
            console.log('Nova resposta iniciada:', data.response.id)
          }
          
          // Transcrição da resposta do assistente
          if (data.type === 'response.output_audio_transcript.delta') {
            currentAssistantTextRef.current += data.delta
            setCurrentAssistantMessage(currentAssistantTextRef.current)
          }
          
          // Resposta completa
          if (data.type === 'response.done') {
            const finalText = currentAssistantTextRef.current.trim()
            console.log('Resposta completa. ID:', data.response.id, 'Texto:', finalText)
            
            if (finalText && currentResponseIdRef.current === data.response.id) {
              console.log('✅ Adicionando à conversa:', finalText)
              setConversation(prev => {
                const updated = [...prev, { role: 'assistant', text: finalText }]
                console.log('Conversa atualizada, total:', updated.length, 'mensagens')
                return updated
              })
              
              // Extrair modalidades para ADICIONAR (procura por "modalidade 1", "recomendo 2", etc)
              const modalityMatches = finalText.match(/modalidade[s]?\s+(\d+)/gi)
              if (modalityMatches && onRecommendation) {
                const numbers = modalityMatches
                  .map(match => {
                    const num = match.match(/\d+/)
                    return num ? parseInt(num[0]) : null
                  })
                  .filter((n): n is number => n !== null && n >= 1 && n <= 7)
                
                if (numbers.length > 0) {
                  console.log('🎯 Modalidades para adicionar:', numbers)
                  onRecommendation(numbers)
                }
              }
              
              // Extrair modalidades para REMOVER (procura por "não precisa", "remover", "tirar", "já não é necessário")
              const removePatterns = [
                /(?:não\s+precis[ao]|remov[ae]r?|tirar|já\s+não\s+(?:é\s+)?necessári[ao]|descartar|eliminar)\s+(?:a\s+)?(?:modalidade\s+)?(\d+)/gi,
                /(?:modalidade\s+)?(\d+)\s+(?:não\s+(?:é\s+)?precis[ao]|já\s+não|desnecessári[ao])/gi
              ]
              
              const numbersToRemove: number[] = []
              removePatterns.forEach(pattern => {
                let match
                while ((match = pattern.exec(finalText)) !== null) {
                  const num = parseInt(match[1])
                  if (num >= 1 && num <= 7 && !numbersToRemove.includes(num)) {
                    numbersToRemove.push(num)
                  }
                }
              })
              
              if (numbersToRemove.length > 0 && onRemoveRecommendation) {
                console.log('❌ Modalidades para remover:', numbersToRemove)
                onRemoveRecommendation(numbersToRemove)
              }
            }
            
            setCurrentAssistantMessage('')
            currentAssistantTextRef.current = ''
            currentResponseIdRef.current = null
          }
          
          // Áudio da resposta
          if (data.type === 'response.output_audio.delta' && data.delta && audioContextRef.current) {
            // Decodificar base64 para PCM16
            const binaryString = atob(data.delta)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            
            // Converter PCM16 para Float32 para AudioContext
            const pcm16 = new Int16Array(bytes.buffer)
            const float32 = new Float32Array(pcm16.length)
            for (let i = 0; i < pcm16.length; i++) {
              float32[i] = pcm16[i] / 32768.0
            }
            
            // Criar AudioBuffer
            const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000)
            audioBuffer.getChannelData(0).set(float32)
            
            // Adicionar à fila
            audioQueueRef.current.push(audioBuffer)
            
            // Iniciar reprodução se não estiver tocando
            if (!isPlayingRef.current) {
              playNextAudioChunk()
            }
          }
          
          // Quando a resposta terminar, limpar a fila após reprodução
          if (data.type === 'response.output_audio.done') {
            console.log('Áudio completo')
          }
          
          if (data.type === 'session.created') {
            console.log('Sessão criada:', data.session.id)
          }
          
          if (data.type === 'session.updated') {
            console.log('Sessão atualizada')
          }
          
          if (data.type === 'error') {
            console.error('Erro do servidor:', data.error)
            setStatusMessage('Erro: ' + data.error.message)
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error)
        }
      }
      
      ws.onerror = (error) => {
        console.error('Erro WebSocket:', error)
        setStatusMessage('Connection error')
        setIsConnected(false)
      }
      
      ws.onclose = () => {
        console.log('WebSocket desconectado')
        setIsConnected(false)
        setStatusMessage('Disconnected')
      }
      
    } catch (error) {
      console.error('Erro ao conectar:', error)
      setStatusMessage('Connection error: ' + (error as Error).message)
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }
  
  const playNextAudioChunk = () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false
      return
    }
    
    isPlayingRef.current = true
    const audioBuffer = audioQueueRef.current.shift()!
    
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContextRef.current.destination)
    
    // Guardar referência para poder parar se necessário
    currentSourcesRef.current.push(source)
    
    // Calcular quando iniciar (agora ou após o chunk anterior)
    const now = audioContextRef.current.currentTime
    const startTime = Math.max(now, nextStartTimeRef.current)
    
    // Agendar próximo chunk
    nextStartTimeRef.current = startTime + audioBuffer.duration
    
    source.onended = () => {
      // Remove da lista de sources ativos
      currentSourcesRef.current = currentSourcesRef.current.filter(s => s !== source)
      playNextAudioChunk()
    }
    
    source.start(startTime)
  }

  const startAudioCapture = () => {
    if (!audioContextRef.current || !mediaStreamRef.current) return
    
    // Resetar timing de reprodução
    nextStartTimeRef.current = audioContextRef.current.currentTime
    
    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current)
    const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1)
    
    processorRef.current = processor
    
    processor.onaudioprocess = (e) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0)
        const pcm16 = new Int16Array(inputData.length)
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]))
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }
        
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)))
        
        wsRef.current.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }))
      }
    }
    
    source.connect(processor)
    processor.connect(audioContextRef.current.destination)
  }
  

  
  const disconnectRealtime = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    stopAllAudio()
    setIsConnected(false)
    setStatusMessage('Disconnected')
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Phone size={24} weight="fill" className="text-purple-600" />
              Voice AI Assistant
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Speak naturally about your needs and receive instant recommendations by voice
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isConnected ? (
              <Button
                onClick={connectRealtime}
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isConnecting}
              >
                <Phone size={20} weight="fill" />
                {isConnecting ? 'Connecting...' : 'Start Conversation'}
              </Button>
            ) : (
              <Button
                onClick={disconnectRealtime}
                size="lg"
                variant="destructive"
                className="gap-2"
              >
                <PhoneDisconnect size={20} weight="fill" />
                End Conversation
              </Button>
            )}
          </div>
        </div>

        {statusMessage && (
          <div className={`rounded-lg p-4 border-2 ${
            isConnected 
              ? 'bg-green-50 border-green-300' 
              : isConnecting 
              ? 'bg-blue-50 border-blue-300 animate-pulse' 
              : 'bg-gray-50 border-gray-300'
          }`}>
            <p className="text-sm font-medium">
              {statusMessage}
            </p>
          </div>
        )}

        {isConnected && (
          <div className="bg-white/80 rounded-lg p-4 border-2 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <Microphone size={20} weight="fill" className="text-purple-600" />
              <p className="text-sm font-medium text-purple-600">Listening in real-time...</p>
            </div>
          </div>
        )}

        {(conversation.length > 0 || isUserSpeaking || currentAssistantMessage) && (
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200 max-h-96 overflow-y-auto space-y-3">
            <div className="flex items-start gap-2 mb-3">
              <SpeakerHigh size={20} weight="fill" className="text-purple-600 mt-0.5" />
              <p className="text-sm font-medium text-gray-800">Conversation:</p>
            </div>
            {conversation.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-purple-50 border-l-4 border-purple-500'}`}>
                <p className="text-xs font-semibold mb-1 uppercase text-gray-700">{msg.role === 'user' ? 'You' : 'Assistant'}</p>
                <p className="text-sm leading-relaxed text-gray-900">{msg.text}</p>
              </div>
            ))}
            {isUserSpeaking && currentUserMessage && (
              <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500 animate-pulse">
                <p className="text-xs font-semibold mb-1 uppercase">Você</p>
                <p className="text-sm leading-relaxed italic">{currentUserMessage}</p>
              </div>
            )}
            {currentAssistantMessage && (
              <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500 animate-pulse">
                <p className="text-xs font-semibold mb-1 uppercase">Assistente</p>
                <p className="text-sm leading-relaxed">{currentAssistantMessage}</p>
              </div>
            )}
          </div>
        )}

        {!isConnected && !isConnecting && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>How to use:</strong> Click "Start Conversation" and allow microphone access. 
              Then, speak naturally about your business needs. The assistant will listen, analyze, and 
              respond by voice with the most suitable recommendations.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
