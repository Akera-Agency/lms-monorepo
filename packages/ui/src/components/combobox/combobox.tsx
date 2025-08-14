import { Check, ChevronsUpDown, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { cn } from '../../lib/utils'
import { Button } from '../button/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover'
import Label from '../label/label'
import { Skeleton } from '../skeleton/skeleton'

type ComboboxItem = {
  label: string
  value: string | number
}

type ComboboxProps = {
  items: ComboboxItem[]
  value?: string | number
  placeholder?: string
  buttonClassName?: string
  commandClassName?: string
  onSelect?: (value: string | number) => void
  label?: string
  required?: boolean
  error?: string
  align?: 'start' | 'center' | 'end'
  isLoading?: boolean
}

const Combobox: React.FC<ComboboxProps> = ({
  items,
  value,
  placeholder = 'Select an option...',
  buttonClassName,
  commandClassName,
  onSelect,
  label,
  required,
  error,
  align = 'center',
  isLoading = false,
}) => {
  const hasError = !!error
  const [open, setOpen] = useState(false)

  const handleSelect = (selectedLabel: string) => {
    const selectedItem = items.find((item) => item.label === selectedLabel)
    if (!selectedItem) return
    const newValue = selectedItem.value === value ? '' : selectedItem.value
    onSelect?.(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {label && <Label className="mb-2" label={label} required={required} />}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'min-w-[250px] justify-between shadow-sm truncate',
            buttonClassName,
            hasError && 'border-destructive',
          )}
        >
          {isLoading ? (
            <Skeleton variant="foreground" className="h-4 w-[100px]" />
          ) : value ? (
            items.find((item) => item.value === value)?.label
          ) : (
            `${placeholder}...`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {hasError && (
        <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-destructive">
          <TriangleAlert className="h-4 w-4" />
          {error}
        </p>
      )}
      <PopoverContent align={align} className={cn('min-w-[250px] p-0', commandClassName)}>
        <Command>
          <CommandInput placeholder={`${placeholder}...`} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="p-2">
                  <Skeleton variant="foreground" className="h-4 w-full" />
                </div>
              ) : (
                'No options found.'
              )}
            </CommandEmpty>
            <CommandGroup>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <CommandItem key={index} className="justify-between">
                      <Skeleton variant="foreground" className="h-4 w-[100px]" />
                      <Skeleton variant="foreground" className="h-4 w-4" />
                    </CommandItem>
                  ))
                : items.map((item) => (
                    <CommandItem
                      key={item.value}
                      // value={item.value.toString()}
                      value={item.label}
                      onSelect={handleSelect}
                      className="justify-between"
                    >
                      {item.label}
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
