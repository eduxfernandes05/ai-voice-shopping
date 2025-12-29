import { AzureOpenAI } from 'openai'

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || ''
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY || ''
const deploymentName = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    if (!endpoint || !apiKey) {
      return 'The assistant is not configured yet. Please set up Azure OpenAI environment variables.'
    }

    // Para Azure AI Foundry, extrair o base endpoint (remover /api/projects/...)
    const baseEndpoint = endpoint.includes('/api/projects/') 
      ? endpoint.split('/api/projects/')[0]
      : endpoint

    // Criar cliente Azure OpenAI para Azure AI Foundry
    const client = new AzureOpenAI({
      endpoint: baseEndpoint,
      apiKey,
      apiVersion: '2024-12-01-preview',
      deployment: deploymentName,
      dangerouslyAllowBrowser: true
    })

    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are a professional AI assistant for Nexus Platform, specializing in helping clients choose the right professional services for their business needs.

AVAILABLE SERVICES:

1. STRATEGIC BUSINESS CONSULTING ($299/month)
When to use: When clients need expert guidance for business transformation and growth.
What it covers: Market analysis, competitive positioning, strategic planning, and action plans.
Best for: Companies looking to scale, pivot, or optimize their business model.

2. TECHNOLOGY ADVISORY SERVICES ($399/month)
When to use: When clients need technical consulting for digital transformation.
What it covers: Cloud migration strategies, technology stack optimization, and architecture reviews.
Best for: Organizations modernizing their tech infrastructure.

3. CUSTOM WEB DEVELOPMENT ($499/month)
When to use: When clients need custom web applications built from scratch.
What it covers: Full-stack development, UI/UX design, deployment, and maintenance.
Best for: Businesses needing tailored web solutions.

4. MOBILE APP DEVELOPMENT ($599/month)
When to use: When clients need native or cross-platform mobile applications.
What it covers: iOS and Android development with cloud integration.
Best for: Companies expanding to mobile platforms.

5. UX/UI DESIGN SERVICES ($349/month)
When to use: When clients need professional design work.
What it covers: User research, interface design, prototyping for web and mobile.
Best for: Projects requiring excellent user experience.

6. PREMIUM SUPPORT PACKAGE ($199/month)
When to use: When clients need ongoing support and maintenance.
What it covers: 24/7 dedicated support, priority bug fixes, monthly consultations.
Best for: Clients with existing projects needing reliable support.

7. TEAM TRAINING & WORKSHOPS ($449/month)
When to use: When teams need upskilling in new technologies.
What it covers: Customized training programs and workshops on latest methodologies.
Best for: Companies investing in team development.

KEY DISTINCTIONS:
- Consulting services (1, 2): Advisory and strategy
- Development services (3, 4): Building solutions
- Design services (5): User experience focus
- Support services (6): Maintenance and help
- Training services (7): Team education

Respond in a professional, friendly manner. Be clear and concise. Help clients understand which services best fit their needs. Do not use markdown formatting - use plain text with dashes and bullet points for organization.`
    }

    const allMessages = [systemMessage, ...messages]

    console.log('Enviando para Azure AI Foundry:', { 
      baseEndpoint, 
      deployment: deploymentName, 
      messagesCount: allMessages.length 
    })

    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: allMessages as any,
      temperature: 0.7,
      max_tokens: 800
    })

    console.log('Resposta do Azure AI Foundry:', result)

    if (result.choices && result.choices.length > 0 && result.choices[0].message.content) {
      return result.choices[0].message.content
    }

    return 'Sorry, I couldn\'t generate a response.'
  } catch (error) {
    console.error('Erro detalhado ao comunicar com Azure AI Foundry:', error)
    
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message)
      console.error('Stack:', error.stack)
      
      if (error.message.includes('não configurado') || error.message.includes('401') || error.message.includes('Unauthorized')) {
        return 'The assistant is not configured correctly. Please check your Azure AI Foundry credentials.'
      }
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        return `Deployment "${deploymentName}" not found. Please verify the deployment name in Azure AI Foundry.`
      }
      return `Error: ${error.message}`
    }
    
    return 'An error occurred while processing your message. Please try again.'
  }
}

export async function getDetailedInfo(topic: string, context: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'user',
      content: `Please provide detailed and complete information about: ${topic}. 

Context: ${context}

Explain in a clear and structured way, including:
- What it is and how it works
- Required documents or requirements
- Important timelines
- Steps to follow
- Useful tips

Respond in a professional but accessible manner.`
    }
  ]

  return await sendChatMessage(messages)
}
