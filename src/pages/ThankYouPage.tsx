import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ModernHeader } from '@/components/ModernHeader'
import { ModernNav } from '@/components/ModernNav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, House, Download } from '@phosphor-icons/react'

export function ThankYouPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = location.state?.orderId || 'NX' + Date.now().toString().slice(-8)

  useEffect(() => {
    // Confetti animation
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Since we're using TypeScript, we'll just skip the confetti if library isn't available
      if (typeof (window as any).confetti === 'function') {
        (window as any).confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        (window as any).confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <ModernHeader />
      <ModernNav />

      <main className="px-6 md:px-12 lg:px-24 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-lg border-2 border-purple-200 shadow-2xl text-center">
            <motion.div variants={itemVariants}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg"
              >
                <CheckCircle size={56} weight="fill" className="text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-700 mb-2"
            >
              Thank you for choosing Nexus Platform
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6 my-8"
            >
              <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
              <p className="text-3xl font-bold text-purple-600 font-mono tracking-wider">
                {orderId}
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              We've received your order and will contact you within 24 hours to discuss next steps. 
              You'll receive a confirmation email with all the details shortly.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left"
            >
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Confirmation email sent to your inbox</li>
                <li>✓ Dedicated account manager assigned</li>
                <li>✓ Kickoff call scheduled within 48 hours</li>
                <li>✓ Access to your client portal activated</li>
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/')}
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 hover:bg-purple-50 text-purple-700 font-semibold"
              >
                <House size={20} className="mr-2" />
                Back to Home
              </Button>

              <Button
                onClick={() => window.location.href = 'https://github.com/eduxfernandes05'}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                <Download size={20} className="mr-2" />
                View Portfolio
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
