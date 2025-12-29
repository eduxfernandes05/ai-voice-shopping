import { Calendar, Bell, MagnifyingGlass, Lock } from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function ModernHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg"
          >
            <Lock size={24} weight="duotone" className="text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Nexus Platform
            </span>
            <span className="text-xs text-gray-600 leading-tight">Professional Services</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Calendar size={24} weight="regular" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Bell size={24} weight="regular" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-purple-600 text-white text-xs font-semibold border-2 border-white">
              3
            </Badge>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            <MagnifyingGlass size={24} weight="regular" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-600 to-blue-600 cursor-pointer ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
