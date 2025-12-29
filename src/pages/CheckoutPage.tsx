import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ModernHeader } from '@/components/ModernHeader'
import { ModernNav } from '@/components/ModernNav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { generateQuotePDF } from '@/lib/pdfGenerator'
import { 
  Check, 
  ArrowLeft, 
  CreditCard, 
  CalendarBlank, 
  Envelope, 
  Phone,
  Download
} from '@phosphor-icons/react'

const serviceDetails: Record<string, { label: string; price: number; description: string }> = {
  'consulting-strategy': { label: 'Strategic Business Consulting', price: 299, description: 'Expert business transformation guidance' },
  'consulting-tech': { label: 'Technology Advisory Services', price: 399, description: 'Technical consulting and optimization' },
  'development-web': { label: 'Custom Web Development', price: 499, description: 'Full-stack web applications' },
  'development-mobile': { label: 'Mobile App Development', price: 599, description: 'Native and cross-platform apps' },
  'design-ux': { label: 'UX/UI Design Services', price: 349, description: 'User experience and interface design' },
  'support-premium': { label: 'Premium Support Package', price: 199, description: '24/7 dedicated support' },
  'training-team': { label: 'Team Training & Workshops', price: 449, description: 'Customized training programs' },
}

export function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedServices = (location.state?.selectedServices as string[]) || []
  const [isProcessing, setIsProcessing] = useState(false)

  if (selectedServices.length === 0) {
    navigate('/selection')
    return null
  }

  const handleCompleteOrder = () => {
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      const orderId = 'NX' + Date.now().toString().slice(-8)
      navigate('/thank-you', { state: { orderId } })
    }, 1500)
  }

  const handleScheduleCall = () => {
    window.open('https://github.com/eduxfernandes05', '_blank')
  }

  const handleDownloadPDF = () => {
    generateQuotePDF(selectedServiceDetails, subtotal, tax, total)
  }

  const selectedServiceDetails = selectedServices.map(id => ({
    id,
    ...serviceDetails[id]
  }))

  const subtotal = selectedServiceDetails.reduce((sum, service) => sum + service.price, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
    >
      <ModernHeader />
      <ModernNav />

      <main className="px-6 md:px-12 lg:px-24 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/selection')}
            className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Selection
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Dashboard</span>
            <span>/</span>
            <span>Service Selection</span>
            <span>/</span>
            <span className="text-purple-600 font-medium">Checkout</span>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Review Your Order
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Confirm your service selection and complete your order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-lg border-2 border-gray-200 shadow-lg">
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-gray-800 mb-6"
              >
                Selected Services
              </motion.h2>

              <div className="space-y-4">
                {selectedServiceDetails.map((service, index) => (
                  <motion.div
                    key={service.id}
                    variants={itemVariants}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Check size={20} weight="bold" className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{service.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">${service.price}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-white/80 backdrop-blur-lg border-2 border-gray-200 shadow-lg">
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-gray-800 mb-6"
              >
                Contact Information
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Envelope size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone size={16} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your Company"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-lg border-2 border-purple-200 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({selectedServices.length} services)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Monthly</span>
                  <span className="text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard size={20} className="mr-2" />
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                </Button>

                <Button
                  onClick={handleScheduleCall}
                  variant="outline"
                  className="w-full h-12 border-2 border-purple-200 hover:bg-purple-50 text-purple-600 font-semibold rounded-xl"
                >
                  <CalendarBlank size={20} className="mr-2" />
                  Schedule a Call
                </Button>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Check size={20} className="text-green-600" />
                  What's Included
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ 30-day money-back guarantee</li>
                  <li>✓ Dedicated account manager</li>
                  <li>✓ Priority support</li>
                  <li>✓ Flexible payment options</li>
                </ul>
              </div>

              <Button
                onClick={handleDownloadPDF}
                variant="ghost"
                className="w-full mt-4 text-gray-600 hover:text-purple-600"
              >
                <Download size={16} className="mr-2" />
                Download Quote (PDF)
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
}
