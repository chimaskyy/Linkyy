import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// List of consonants and vowels for generating memorable codes
const consonants = "bcdfghjklmnpqrstvwxyz"
const vowels = "aeiou"
const memorableLength = 4 // Short enough to be memorable

export function generateShortCode(length = 6): string {
  // For memorable codes, alternate consonants and vowels
  if (length <= memorableLength) {
    let result = ""
    const startWithConsonant = Math.random() > 0.5

    for (let i = 0; i < length; i++) {
      // Alternate between consonants and vowels
      const charSet = (i % 2 === 0) === startWithConsonant ? consonants : vowels
      result += charSet.charAt(Math.floor(Math.random() * charSet.length))
    }

    return result
  }

  // For longer codes, use the original method
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
