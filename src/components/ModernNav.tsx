import { motion } from 'framer-motion'
import { House, FileText, Package, ChartBar, Gear, Users } from '@phosphor-icons/react'

const navItems = [
  { icon: House, label: 'Dashboard', active: false },
  { icon: FileText, label: 'Services', active: true },
  { icon: Package, label: 'Products', active: false },
  { icon: ChartBar, label: 'Analytics', active: false },
  { icon: Users, label: 'Team', active: false },
  { icon: Gear, label: 'Settings', active: false },
]

export function ModernNav() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 px-8 py-3"
    >
      <div className="flex items-center gap-1">
        {navItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              item.active
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-white/60 hover:text-purple-600'
            }`}
          >
            <item.icon size={20} weight={item.active ? 'fill' : 'regular'} />
            <span className="text-sm">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}
