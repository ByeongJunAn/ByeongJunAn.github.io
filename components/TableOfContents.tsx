'use client'

import React, { useState, useEffect } from 'react'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'

const TableOfContents = ({ headings }) => {
  const highestLevel = Math.min(...headings.map((heading) => heading.level))
  const [visibleHeadings, setVisibleHeadings] = useState({})

  useEffect(() => {
    const initialVisibility = {}
    headings.forEach((heading) => {
      if (heading.level === highestLevel) {
        initialVisibility[heading.id] = false // 최상위 레벨은 처음에 접혀있음
      }
    })
    setVisibleHeadings(initialVisibility)
  }, [headings, highestLevel])

  const toggleVisibility = (id, level) => {
    setVisibleHeadings((prev) => {
      const newVisibility = { ...prev }

      if (level === highestLevel) {
        // 최상위 레벨을 클릭하면 모든 하위 항목을 접음
        headings.forEach((heading) => {
          if (heading.level > highestLevel) {
            newVisibility[heading.id] = false
          }
        })
      }

      if (newVisibility[id]) {
        // 현재 항목을 닫을 때 자식 항목도 모두 닫음
        headings.forEach((heading) => {
          if (heading.parentId === id || heading.id === id) {
            newVisibility[heading.id] = false
          }
        })
      } else {
        newVisibility[id] = true
      }

      return newVisibility
    })
  }

  const isParentVisible = (heading) => {
    if (heading.level === highestLevel) return true
    const parent = headings.find((h) => h.id === heading.parentId)
    return parent ? visibleHeadings[parent.id] : false
  }

  const hasChildren = (id) => {
    return headings.some((heading) => heading.parentId === id)
  }

  return (
    <nav className="p-4 pl-8  ">
      <div className="py-4 text-3xl font-bold text-sky-600 ">Contents</div>
      <ul>
        {headings.map((heading) => {
          const marginLeft = `${(heading.level - highestLevel) * 16}px` // 16px = 1rem
          const fontClass = heading.level === highestLevel ? 'font-bold' : ''
          const icon = hasChildren(heading.id) ? (
            visibleHeadings[heading.id] ? (
              <AiOutlineMinusCircle />
            ) : (
              <AiOutlinePlusCircle />
            )
          ) : (
            ''
          )
          const isVisible = isParentVisible(heading)

          return (
            <li
              key={heading.id}
              className={`${fontClass} mb-2 ${isVisible ? '' : 'hidden'}`}
              style={{ marginLeft }}
            >
              <a
                href={`#${heading.id}`}
                className="flex items-center text-sky-700 transition-colors duration-200 hover:text-sky-500"
                onClick={(e) => {
                  if (hasChildren(heading.id)) {
                    e.preventDefault()
                    toggleVisibility(heading.id, heading.level)
                  }
                }}
              >
                <span className="mr-2">{icon}</span>
                {heading.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TableOfContents
