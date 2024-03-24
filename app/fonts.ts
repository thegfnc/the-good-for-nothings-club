import { Alegreya, Rubik, Rubik_Glitch } from 'next/font/google'

export const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--font-alegreya',
})

export const rubik = Rubik({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-rubik',
})

export const rubikGlitch = Rubik_Glitch({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--font-rubik-glitch',
})
