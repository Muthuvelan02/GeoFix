"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const toggleVisibility = () => {
      // Throttle the scroll event for better performance
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        // Show button when user scrolls down 400px
        if (window.pageYOffset > 400) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }, 100)
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const scrollToTop = () => {
    console.log('Back to top button clicked') // Debug log
    import('../lib/smoothScroll').then(({ smoothScrollToTop }) => {
      smoothScrollToTop(1000)
    })
  }

  return (
    <div
      className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 transition-all duration-300 ${
        isVisible 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="cursor-pointer group p-2.5 md:p-3 bg-[#0078D7] hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 backdrop-blur-sm"
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>
    </div>
  )
}
