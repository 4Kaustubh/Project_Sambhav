"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Settings } from "lucide-react"

export function Header({ title, role }) {
  const [notifications] = useState(3) // Mock notification count

  const handleLogout = () => {
    // In real app, this would clear auth and redirect
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
            <img src="/sambhav_icon.png" alt="Sambhav Icon" className="h-15 w-25" />
              <div>
                <p className="text-lg font-bold text-gray-600 mt-5">{title}</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={handleLogout}>
  <LogOut className="h-5 w-5" />
  <span className="hidden sm:inline">Logout</span>
</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
