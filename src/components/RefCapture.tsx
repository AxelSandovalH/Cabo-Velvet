'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function RefCapture() {
  const params = useSearchParams()

  useEffect(() => {
    const ref = params.get('ref')
    if (ref && ref.length > 0 && ref.length < 64) {
      localStorage.setItem('cr_ref', ref)
    }
  }, [params])

  return null
}
