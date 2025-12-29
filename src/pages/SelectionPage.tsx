import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ModernHeader } from '@/components/ModernHeader'
import { ModernNav } from '@/components/ModernNav'
import { ServiceSelectionForm } from '@/components/ServiceSelectionForm'
import { ChatAssistant } from '@/components/ChatAssistant'
import { FloatingChatButton } from '@/components/FloatingChatButton'
import { VoiceAssistant } from '@/components/VoiceAssistant'
import { Button } from '@/components/ui/button'
import { ArrowRight } from '@phosphor-icons/react'

export function SelectionPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>()
  const navigate = useNavigate()

  const handleOpenChatWithQuestion = (question: string) => {
    setChatInitialQuestion(question)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setTimeout(() => setChatInitialQuestion(undefined), 300)
  }

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      navigate('/checkout', { state: { selectedServices } })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-y-auto"
    >
      <ModernHeader />
      <ModernNav />

      <main className="px-6 md:px-12 lg:px-24 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-purple-600 font-medium">Service Selection</span>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Choose Your Services
          </h1>
          <p className="text-gray-600 text-lg">
            Select the services you need and we'll create a customized package for you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-xl mb-8 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How it works</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Select the services that match your needs</li>
                <li>• Review your selections and pricing in the checkout</li>
                <li>• Our team will contact you within 24 hours to get started</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <VoiceAssistant
          onRecommendation={(serviceNumbers) => {
            const serviceMap: Record<number, string> = {
              1: 'consulting-strategy',
              2: 'consulting-tech',
              3: 'development-web',
              4: 'development-mobile',
              5: 'design-ux',
              6: 'support-premium',
              7: 'training-team'
            }
            
            const idsToSelect = serviceNumbers
              .map(num => serviceMap[num])
              .filter(id => id !== undefined)
            
            setSelectedServices(current => {
              const newSelections = [...current]
              idsToSelect.forEach(id => {
                if (!newSelections.includes(id)) {
                  newSelections.push(id)
                }
              })
              return newSelections
            })
          }}
          onRemoveRecommendation={(serviceNumbers) => {
            const serviceMap: Record<number, string> = {
              1: 'consulting-strategy',
              2: 'consulting-tech',
              3: 'development-web',
              4: 'development-mobile',
              5: 'design-ux',
              6: 'support-premium',
              7: 'training-team'
            }
            
            const idsToRemove = serviceNumbers
              .map(num => serviceMap[num])
              .filter(id => id !== undefined)
            
            setSelectedServices(current => 
              current.filter(id => !idsToRemove.includes(id))
            )
          }}
        />

        <ServiceSelectionForm
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          onOpenChatWithQuestion={handleOpenChatWithQuestion}
        />

        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-end"
          >
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Checkout
              <ArrowRight size={24} weight="bold" className="ml-2" />
            </Button>
          </motion.div>
        )}
      </main>

      <ChatAssistant
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialQuestion={chatInitialQuestion}
      />

      {!isChatOpen && (
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      )}
    </motion.div>
  )
}
