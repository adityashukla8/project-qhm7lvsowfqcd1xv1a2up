import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface EligibilityTextProps {
  text: string
  maxItems?: number
  maxChars?: number
  className?: string
}

const EligibilityText = ({ 
  text, 
  maxItems = 3, 
  maxChars = 300, 
  className = "" 
}: EligibilityTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Parse text into bullet points
  const parseBulletPoints = (text: string): string[] => {
    if (!text) return []
    
    // Split by common bullet markers: *, -, •, or numbered lists
    const bulletRegex = /(?:^|\n)\s*(?:[*\-•]|\d+\.)\s*(.+?)(?=\n\s*(?:[*\-•]|\d+\.)|$)/gs
    const matches = text.match(bulletRegex)
    
    if (matches && matches.length > 1) {
      // Clean up the bullet points
      return matches.map(match => 
        match.replace(/^[\n\s]*[*\-•\d.]\s*/, '').trim()
      ).filter(item => item.length > 0)
    }
    
    // If no clear bullet structure, split by periods or semicolons for long text
    if (text.length > 100) {
      const sentences = text.split(/[.;]\s+/).filter(s => s.trim().length > 10)
      if (sentences.length > 1) {
        return sentences.map(s => s.trim() + (s.endsWith('.') ? '' : '.'))
      }
    }
    
    // Return as single item if no clear structure
    return [text.trim()]
  }

  const bulletPoints = parseBulletPoints(text)
  const shouldTruncate = bulletPoints.length > maxItems || text.length > maxChars
  
  const displayItems = isExpanded ? bulletPoints : bulletPoints.slice(0, maxItems)
  const isTruncatedByLength = !isExpanded && text.length > maxChars

  return (
    <div className={`space-y-3 ${className}`}>
      {bulletPoints.length > 1 ? (
        <ul className="space-y-3">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {isTruncatedByLength && index === displayItems.length - 1 && item.length > 100
                  ? `${item.substring(0, 100)}...`
                  : item
                }
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {isTruncatedByLength ? `${text.substring(0, maxChars)}...` : text}
        </p>
      )}
      
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto font-medium min-h-[44px] touch-manipulation"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              <span className="text-left">
                Show more {bulletPoints.length > maxItems && `(${bulletPoints.length - maxItems} more items)`}
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export default EligibilityText