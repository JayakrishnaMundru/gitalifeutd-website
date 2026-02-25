'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function ToastOnLoad({ message }: { message?: string }) {
  useEffect(() => {
    if (message) toast.success(message)
  }, [message])
  return null
}
