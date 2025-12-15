import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withBasePath(path: string) {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${prefix}${path}`
}
