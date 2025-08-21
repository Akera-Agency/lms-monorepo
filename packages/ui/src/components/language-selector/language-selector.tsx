import { Select } from '../form/select'
import { cn } from '../../lib/utils'
import { Flag } from 'lucide-react'

interface LanguageSelectorProps {
  className?: string
}

const languages = [
  {
    label: 'English',
    value: 'en',
    icon: <Flag className="mr-2 inline" />,
  },
  {
    label: 'عربي',
    value: 'ar',
    icon: <Flag className="mr-2 inline" />,
  },
  {
    label: 'French',
    value: 'fr',
    icon: <Flag className="mr-2 inline" />,
  },
  {
    label: 'Deutsch',
    value: 'es',
    icon: <Flag className="mr-2 inline" />,
  },
]

const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  return (
    <Select className={cn(className, 'w-36 rounded-full')} defaultValue="en" items={languages} />
  )
}

export default LanguageSelector
