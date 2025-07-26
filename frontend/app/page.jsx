"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, TrendingUp, MapPin, Eye, EyeOff, ArrowRight, Sparkles, Heart, Award, Target } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (email && password && selectedRole) {
      setIsLoading(true)
      // Simulate loading
      setTimeout(() => {
        window.location.href = `/${selectedRole}-dashboard`
      }, 1500)
    }
  }

  const roles = [
    { value: "data-collector", label: "Data Collector", icon: "📊", description: "Collect and manage trainee data" },
    { value: "trainer", label: "Trainer", icon: "👨‍🏫", description: "Train and evaluate candidates" },
    { value: "admin", label: "Admin", icon: "⚙️", description: "Oversee all operations" },
    { value: "placement-officer", label: "Placement Officer", icon: "🤝", description: "Connect trainees with jobs" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23fed7aa fillOpacity=0.3%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                  <img src="/sambhav_icon.png" alt="Sambhav Logo" className="h-16 w-28 object-contain" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3">
              Sambhav Foundation
            </h1>
            <p className="text-gray-600 text-lg font-medium">Empowering Communities Through Training & Placement</p>
            <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
              Transforming Lives, Building Futures
            </div>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-base">
                Sign in to access your personalized dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-4 pr-4 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-4 pr-12 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                    Select Your Role
                  </Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole} required>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-xl">
                      <SelectValue placeholder="Choose your role to continue" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value} className="py-3 px-4 hover:bg-orange-50">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{role.icon}</span>
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Sign In to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

            </CardContent>
          </Card>

          {/* Enhanced Stats */}
          <div className="mt-8 animate-fade-in-up delay-300">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Our Impact</h3>
              <p className="text-sm text-gray-600">Making a difference in communities across India</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">5000+</div>
                  <div className="text-xs text-gray-600 font-medium">Lives Trained</div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">85%</div>
                  <div className="text-xs text-gray-600 font-medium">Success Rate</div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
                  <div className="text-xs text-gray-600 font-medium">Centers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>© 2024 Sambhav Foundation. Empowering communities since 2020.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  )
}
