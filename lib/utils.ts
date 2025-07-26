import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProjectStatusColor(status: string): string {
  switch (status) {
    case 'In Progress':
      return 'bg-green-300'
    case 'Completed':
      return 'bg-blue-300'
    case 'Paused':
      return 'bg-yellow-300'
    case 'Canceled':
      return 'bg-red-300'
    default:
      return 'bg-gray-300'
  }
}
