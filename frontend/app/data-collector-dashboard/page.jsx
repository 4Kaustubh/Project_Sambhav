"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Header } from "@/components/header"
import { Sparkles, CheckCircle, ArrowRight, Users, Award, TrendingUp } from "lucide-react"

export default function DataCollectorDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    education: "",
    age: "",
    gender: "",
    experience: "",
    location: "",
    disability: "",
    breadwinner: "",
    englishKnowledge: "",
    phone: "",
    job: "",
  })
  const [recommendation, setRecommendation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const recommend_data = {
      educationa: formData.education,
      experience: formData.experience,
      "Location PIN/ZIP": formData.location,
      gender: formData.gender,
      disability: formData.disability,
      soleEarner: formData.breadwinner,
      english: formData.englishKnowledge,
      preference: formData.preference,
      // "job": formData.job
    }

    try {
      const response = await fetch("http://localhost:5001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      console.log("Recommendation data:", data)
      setRecommendation(data)
    } catch (error) {
      console.error("Error fetching recommendation:", error)
    }

    setIsLoading(false)
  }

  // Register trainee in backend
  const handleProceedRegistration = async () => {
    setIsLoading(true)
    setRegistrationSuccess(false)

    // Convert string fields to booleans for backend
    const registrationData = {
      name: formData.name || "Test User",
      education: ["5th", "10th", "12th", "diploma"].includes(formData.education) ? formData.education : "10th",
      age: formData.age ? Number(formData.age) : 22,
      gender: ["male", "female", "other"].includes(formData.gender) ? formData.gender : "male",
      experience: formData.experience || "None",
      location: formData.location || "110001",
      disability: formData.disability === "yes",
      breadwinner: formData.breadwinner === "yes",
      english_knowledge: formData.englishKnowledge === "yes",
    }

    try {
      const res = await fetch("http://localhost:5000/api/trainees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      if (res.ok) {
        setRegistrationSuccess(true)
      } else {
        const errorData = await res.json()
        if (errorData && errorData.errors) {
          alert("Registration failed: " + errorData.errors.join(", "))
        } else if (errorData && errorData.error) {
          alert("Registration failed: " + errorData.error)
        } else {
          alert("Registration failed. Please try again.")
        }
      }
    } catch (err) {
      alert("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23fed7aa fillOpacity=0.2%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10">
        <Header title="Data Collection" role="Data Collector" />

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                Trainee Registration
              </h2>
              <p className="text-gray-600 text-lg">
                Collect trainee information to get personalized job recommendations
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-md">
                  <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">1,247</div>
                  <div className="text-xs text-gray-600">Registered Today</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-md">
                  <Award className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">94%</div>
                  <div className="text-xs text-gray-600">Match Accuracy</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-md">
                  <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-900">2.3s</div>
                  <div className="text-xs text-gray-600">Avg Response</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Form */}
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out all fields to get the best job recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-semibold text-gray-700">
                        Age *
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                        className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Education Qualification *</Label>
                      <Select
                        value={formData.education}
                        onValueChange={(value) => handleInputChange("education", value)}
                      >
                        <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5th">5th Standard</SelectItem>
                          <SelectItem value="10th">10th Standard</SelectItem>
                          <SelectItem value="12th">12th Standard</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                      Prior Experience
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Describe any previous work experience..."
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      rows={3}
                      className="border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                        Location (ZIP Code) *
                      </Label>
                      <Input
                        id="location"
                        placeholder="Enter ZIP code"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                        className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Do you have any disability?</Label>
                      <RadioGroup
                        value={formData.disability}
                        onValueChange={(value) => handleInputChange("disability", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="disability-yes" />
                          <Label htmlFor="disability-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="disability-no" />
                          <Label htmlFor="disability-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Are you the primary breadwinner?</Label>
                      <RadioGroup
                        value={formData.breadwinner}
                        onValueChange={(value) => handleInputChange("breadwinner", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="breadwinner-yes" />
                          <Label htmlFor="breadwinner-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="breadwinner-no" />
                          <Label htmlFor="breadwinner-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Do you have English language knowledge?
                      </Label>
                      <RadioGroup
                        value={formData.englishKnowledge}
                        onValueChange={(value) => handleInputChange("englishKnowledge", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="english-yes" />
                          <Label htmlFor="english-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="english-no" />
                          <Label htmlFor="english-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing Profile...
                      </>
                    ) : (
                      <>
                        Get Job Recommendations
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Enhanced Recommendation */}
            <div className="space-y-6">
              {Array.isArray(recommendation) && recommendation.length > 0 ? (
                <>
                  {recommendation.map((rec, idx) => (
                    <Card
                      key={idx}
                      className="shadow-2xl border-0 backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 animate-slide-up delay-200"
                    >
                      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-green-800 text-xl">
                          <CheckCircle className="h-6 w-6" />
                          AI Recommendation #{idx + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold text-green-900 mb-3">{rec.vertical}</h3>
                          <div className="inline-flex items-center px-4 py-2 rounded-full text-base font-semibold bg-green-100 text-green-800">
                            {rec.confidence}% Perfect Match
                          </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md">
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">Why this recommendation?</h4>
                          <p className="text-gray-700 leading-relaxed">{rec.justification}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md">
                            <div className="text-2xl font-bold text-orange-600">{rec.duration}</div>
                            <div className="text-sm text-gray-600 font-medium">Training Duration</div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md">
                            <div className="text-2xl font-bold text-green-600">{rec.placement_rate}</div>
                            <div className="text-sm text-gray-600 font-medium">Placement Rate</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Job Preference Selection */}
                  <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up delay-300">
                    <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
                      <CardTitle className="text-xl text-gray-900">Select Your Preference</CardTitle>
                      <CardDescription className="text-base">
                        Choose your preferred job vertical from the recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="preference" className="text-sm font-semibold text-gray-700">
                          Select your preferred job vertical *
                        </Label>
                        <Select value={formData.job || ""} onValueChange={(value) => handleInputChange("job", value)}>
                          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg">
                            <SelectValue placeholder="Choose your preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {recommendation.map((rec, idx) => (
                              <SelectItem key={idx} value={rec.vertical}>
                                {rec.vertical}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                        onClick={handleProceedRegistration}
                        disabled={isLoading || registrationSuccess}
                      >
                        {registrationSuccess ? (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Registration Successful!
                          </>
                        ) : isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Registering...
                          </>
                        ) : (
                          "Proceed with Registration"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 border-dashed border-gray-300 animate-slide-up delay-100">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full mb-6">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">AI-Powered Job Matching</h3>
                    <p className="text-gray-600 max-w-sm leading-relaxed">
                      Complete the form to get personalized job recommendations based on your profile and local
                      opportunities.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
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
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}