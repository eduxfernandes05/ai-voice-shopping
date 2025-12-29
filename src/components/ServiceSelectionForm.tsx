import { Info } from '@phosphor-icons/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface ServiceOption {
  id: string
  label: string
  shortDesc: string
  price?: string
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'consulting-strategy',
    label: 'Strategic Business Consulting',
    shortDesc: 'Expert guidance for business transformation and growth strategies. Includes market analysis, competitive positioning, and action plans.',
    price: '$299/month'
  },
  {
    id: 'consulting-tech',
    label: 'Technology Advisory Services',
    shortDesc: 'Technical consulting for digital transformation, cloud migration, and technology stack optimization.',
    price: '$399/month'
  },
  {
    id: 'development-web',
    label: 'Custom Web Development',
    shortDesc: 'Full-stack web application development with modern frameworks. Includes design, development, and deployment.',
    price: '$499/month'
  },
  {
    id: 'development-mobile',
    label: 'Mobile App Development',
    shortDesc: 'Native and cross-platform mobile applications for iOS and Android with cloud integration.',
    price: '$599/month'
  },
  {
    id: 'design-ux',
    label: 'UX/UI Design Services',
    shortDesc: 'User experience research, interface design, and prototyping for web and mobile applications.',
    price: '$349/month'
  },
  {
    id: 'support-premium',
    label: 'Premium Support Package',
    shortDesc: '24/7 dedicated support with guaranteed response times, priority bug fixes, and monthly consultations.',
    price: '$199/month'
  },
  {
    id: 'training-team',
    label: 'Team Training & Workshops',
    shortDesc: 'Customized training programs and workshops for your team on latest technologies and methodologies.',
    price: '$449/month'
  }
]

interface ServiceSelectionFormProps {
  selectedServices: string[]
  setSelectedServices: (update: (current: string[]) => string[]) => void
  onOpenChatWithQuestion?: (question: string) => void
}

export function ServiceSelectionForm({ 
  selectedServices, 
  setSelectedServices, 
  onOpenChatWithQuestion 
}: ServiceSelectionFormProps) {
  const handleCheckboxChange = (serviceId: string, checked: boolean) => {
    setSelectedServices((current) => {
      if (checked) {
        return [...current, serviceId]
      } else {
        return current.filter(id => id !== serviceId)
      }
    })
  }

  const handleNeedHelp = (label: string) => {
    if (onOpenChatWithQuestion) {
      onOpenChatWithQuestion(`Tell me more about: ${label}`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      >
        Select Your Services
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {serviceOptions.map((option) => (
          <motion.div
            key={option.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 10 }}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
              selectedServices.includes(option.id)
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 shadow-md'
                : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm'
            }`}
          >
            <Checkbox
              id={option.id}
              checked={selectedServices.includes(option.id)}
              onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
              className="h-6 w-6 mt-0.5 rounded-md border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600 data-[state=checked]:border-purple-600 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <label
                  htmlFor={option.id}
                  className="text-base font-semibold text-gray-800 cursor-pointer"
                >
                  {option.label}
                </label>
                {option.price && (
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {option.price}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{option.shortDesc}</p>
              <div className="flex items-center gap-2 mt-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          handleNeedHelp(option.label)
                        }}
                      >
                        <Info size={16} weight="fill" />
                        More Info
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-sm p-4 bg-white border-2 border-purple-200">
                      <p className="text-sm leading-relaxed text-gray-700 mb-3">{option.shortDesc}</p>
                      <Button
                        size="sm"
                        className="w-full text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={() => handleNeedHelp(option.label)}
                      >
                        Need Help?
                      </Button>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl border-2 border-purple-200"
        >
          <p className="text-sm font-semibold text-purple-800">
            ✓ {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}
    </div>
  )
}
