import { useState } from 'react'
import { ChatsCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface FloatingChatButtonProps {
  onClick: () => void
}

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <ChatsCircle 
          size={32} 
          weight="fill"
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </Button>
      
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap">
          <div className="bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            Precisa de ajuda?
          </div>
        </div>
      )}
    </div>
  )
}
