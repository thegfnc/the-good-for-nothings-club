// code from https://github.com/cedricdelpoux/react-responsive-masonry/

'use client'

import {
  Children,
  ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { cn } from '../lib/utils'

const DEFAULT_COLUMNS_COUNT = 1

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

const useWindowWidth = () => {
  const hasMounted = useHasMounted()
  const [width, setWidth] = useState(window.innerWidth)

  const handleResize = useCallback(() => {
    if (!hasMounted) return
    setWidth(window.innerWidth)
  }, [hasMounted])

  useEffect(() => {
    if (hasMounted) {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [hasMounted, handleResize])

  return width
}

const getColumns = (children: ReactNode, columnsCount: number) => {
  const columns: ReactNode[][] = Array.from({ length: columnsCount }, () => [])
  let validIndex = 0

  Children.forEach(children, child => {
    if (child && isValidElement(child)) {
      columns[validIndex % columnsCount].push(child)
      validIndex++
    }
  })

  return columns
}

type MasonryProps = {
  columnsCountBreakPoints?: Record<string, number>
  children: ReactNode
  columnsCount?: number
  className?: string
}

export default function Masonry({
  columnsCountBreakPoints = {
    0: 1,
    768: 2,
    1280: 3,
  },
  children,
  className,
}: MasonryProps) {
  const windowWidth = useWindowWidth()

  const columnsCount = useMemo(() => {
    const breakPoints = Object.keys(columnsCountBreakPoints).sort(
      (a, b) => Number(a) - Number(b)
    )

    let count =
      breakPoints.length > 0
        ? columnsCountBreakPoints[breakPoints[0]]
        : DEFAULT_COLUMNS_COUNT

    breakPoints.forEach(breakPoint => {
      if (Number(breakPoint) < windowWidth) {
        count = columnsCountBreakPoints[breakPoint]
      }
    })

    return count
  }, [windowWidth, columnsCountBreakPoints])

  return (
    <div
      className={cn(
        'flex w-full flex-row items-stretch justify-center',
        className
      )}
    >
      {getColumns(children, columnsCount).map((column, i) => (
        <div
          key={i}
          className={cn(
            'flex w-0 flex-1 flex-col content-stretch justify-start',
            className
          )}
        >
          {column.map(item => item)}
        </div>
      ))}
    </div>
  )
}
