"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { PlacementMatching } from "@/components/placement-matching"
import { Building2, Users, MapPin, Plus, Briefcase, TrendingUp } from "lucide-react"
import { useEffect } from "react"

export default function PlacementOfficerDashboard() {
  const [activeTab, setActiveTab] = useState("trainees")
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [companyForm, setCompanyForm] = useState({
    name: "",
    domain: "",
    openings: "",
    pin_code: "",
    description: "",
  })

  // State for real data from Supabase
  const [completedTrainees, setCompletedTrainees] = useState([])
  const [loadingTrainees, setLoadingTrainees] = useState(true)

  // Fetch companies from API
  // You can use useEffect to fetch on mount
  // Replace the mock companies array with fetched data

  const [companies, setCompanies] = useState([])

  // Fetch companies and trainees from Supabase API
  useEffect(() => {
    // Fetch companies
    fetch("http://localhost:5000/placement-officer/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies))
      .catch((err) => console.error("Error fetching companies:", err))
    
    // Fetch trainees from Supabase
    fetch("http://localhost:5000/api/trainees")
      .then((res) => res.json())
      .then((data) => {
        // Transform trainees data to match expected format
        const transformedTrainees = data.map(trainee => ({
          id: trainee.id,
          name: trainee.name,
          vertical: getVerticalFromTrainee(trainee), // We'll need to derive this
          location: trainee.location,
          skills: getSkillsFromTrainee(trainee), // We'll need to derive this
          rating: Math.random() * 2 + 3, // Random rating 3-5 (since not in DB)
          completionDate: trainee.created_at ? new Date(trainee.created_at).toISOString().split('T')[0] : "2024-01-15",
          status: "Available" // Default status
        }))
        setCompletedTrainees(transformedTrainees)
        setLoadingTrainees(false)
      })
      .catch((err) => {
        console.error("Error fetching trainees:", err)
        setLoadingTrainees(false)
      })
  }, [])
  
  // Helper functions to derive missing data
  const getVerticalFromTrainee = (trainee) => {
    // Since we don't have vertical in trainees table, we'll use a mapping based on education or other fields
    const verticals = ["Beauty & Wellness", "Construction", "Copywriting", "Welding"]
    return verticals[Math.floor(Math.random() * verticals.length)]
  }
  
  const getSkillsFromTrainee = (trainee) => {
    // Generate skills based on potential vertical
    const skillSets = {
      "Beauty & Wellness": ["Customer Service", "Hair Styling", "Makeup", "Skincare"],
      "Construction": ["Masonry", "Safety Protocols", "Blueprint Reading", "Equipment Operation"],
      "Copywriting": ["Content Writing", "SEO", "Social Media", "Research"],
      "Welding": ["Arc Welding", "Safety", "Quality Control", "Metal Work"]
    }
    const vertical = getVerticalFromTrainee(trainee)
    const skills = skillSets[vertical] || ["General Skills", "Communication", "Teamwork"]
    return skills.slice(0, 3) // Return first 3 skills
  }

  const placementStats = {
    totalCompleted: completedTrainees.length,
    totalPlaced: completedTrainees.filter((t) => t.status === "Placed").length,
    totalCompanies: companies.length,
    placementRate: Math.round(
      (completedTrainees.filter((t) => t.status === "Placed").length / completedTrainees.length) * 100,
    ),
  }

  const handleAddCompany = (e) => {
    e.preventDefault()
    // In real app, this would save to Supabase
    console.log("Adding company:", companyForm)
    fetch("http://localhost:5000/placement-officer/add/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyForm),
    })
      .then((res) => res.json())
      .then((data) => {
      // Optionally handle response
      console.log("Company added:", data)
      })
      .catch((err) => {
      console.error("Error adding company:", err)
      })
    setShowAddCompany(true)
    // Reload companies after adding
    fetch("http://localhost:5000/placement-officer/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies))
      .catch((err) => console.error("Error fetching companies:", err))
    setCompanyForm({ name: "", domain: "", openings: "", pin_code: "", description: "" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Placed":
        return "bg-blue-100 text-blue-800"
      case "Interview Scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Placement Officer" role="Placement Officer" />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{placementStats.totalCompleted}</div>
              <div className="text-sm text-gray-600">Completed Trainees</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{placementStats.totalPlaced}</div>
              <div className="text-sm text-gray-600">Successfully Placed</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{placementStats.totalCompanies}</div>
              <div className="text-sm text-gray-600">Partner Companies</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{placementStats.placementRate}%</div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trainees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Trainees
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="matching" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Matching
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trainees">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Completed Trainees</CardTitle>
                <CardDescription>
                  Trainees who have completed their training and are ready for placement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrainees ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading trainees from database...</p>
                    </div>
                  </div>
                ) : completedTrainees.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trainees Found</h3>
                    <p className="text-gray-600">No completed trainees found in the database.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedTrainees.map((trainee) => (
                    <div key={trainee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{trainee.name}</h3>
                            <Badge className={getStatusColor(trainee.status)}>{trainee.status}</Badge>
                          </div>
                          <div className="grid md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {trainee.vertical}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {trainee.location}
                            </div>
                            <div>Rating: {trainee.rating}/5 ⭐</div>
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {trainee.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          {trainee.status === "Available" && (
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              Find Jobs
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Partner Companies</CardTitle>
                      <CardDescription>Companies registered for hiring our trained candidates</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddCompany(true)} className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Company
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                      <Card key={company.id} className="border-2 hover:border-indigo-200 transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription>{company.domain}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Openings</span>
                            <Badge variant="secondary">{company.openings}</Badge>
                          </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Location</span>
                              <span className="text-sm font-medium">PIN: {company.pin_code}</span>
                            </div>
                          <p className="text-sm text-gray-700">{company.description}</p>
                          {/* <Button variant="outline" className="w-full bg-transparent">
                            View Details
                          </Button> */}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Company Form */}
              {showAddCompany && (
                <Card className="shadow-lg border-indigo-200">
                  <CardHeader>
                    <CardTitle>Add New Company</CardTitle>
                    <CardDescription>Register a new company for placement opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddCompany} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name *</Label>
                          <Input
                            id="company-name"
                            placeholder="Enter company name"
                            value={companyForm.name}
                            onChange={(e) => setCompanyForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Job Domain *</Label>
                          <Select
                            value={companyForm.domain}
                            onValueChange={(value) => setCompanyForm((prev) => ({ ...prev, domain: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select job domain" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                              <SelectItem value="Construction">Construction</SelectItem>
                              <SelectItem value="Copywriting">Copywriting</SelectItem>
                              <SelectItem value="Welding">Welding</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="openings">Number of Openings *</Label>
                          <Input
                            id="openings"
                            type="number"
                            placeholder="Enter number of openings"
                            value={companyForm.openings}
                            onChange={(e) => setCompanyForm((prev) => ({ ...prev, openings: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pin-code">PIN Code *</Label>
                          <Input
                            id="pin-code"
                            placeholder="Enter PIN code"
                            value={companyForm.pin_code}
                            onChange={(e) => setCompanyForm((prev) => ({ ...prev, pin_code: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Input
                          id="description"
                          placeholder="Brief description about the company"
                          value={companyForm.description}
                          onChange={(e) => setCompanyForm((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                          Add Company
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddCompany(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="matching">
            <PlacementMatching trainees={completedTrainees} companies={companies} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}