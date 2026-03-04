"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      const response = await fetch("/api/refresh-content", {
        method: "POST",
      })

      if (response.ok) {
        // Refresh the current page to show updated content
        router.refresh()
      }
    } catch (error) {
      console.error("Error refreshing content:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2 border-[#E8E5E0]/35 bg-transparent text-[#E8E5E0] hover:bg-[#E8E5E0]/10"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Refreshing..." : "Refresh Content"}
    </Button>
  )
}
