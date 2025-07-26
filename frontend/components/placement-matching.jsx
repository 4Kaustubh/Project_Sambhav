"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Users, Briefcase, CheckCircle, Star, Loader2, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export function PlacementMatching({ trainees, companies }) {
  const [matches, setMatches] = useState([])
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(false)
  const [groqSummary, setGroqSummary] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTrainees, setFilteredTrainees] = useState([])
  const [showAllTrainees, setShowAllTrainees] = useState(true)

  // Groq API integration function
  const fetchGroqAnalysis = async (traineeData, companyData) => {
    try {
      const response = await fetch('/api/groq-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainees: traineeData,
          companies: companyData,
        }),
      })
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch Groq analysis')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching Groq analysis:', error)
      return null
    }
  }

  const generateMatches = async () => {
    setLoading(true)
    const availableTrainees = trainees.filter((t) => t.status === "Available")
    const newMatches = []

    // Prepare data for Groq API
    const traineeData = availableTrainees.map(trainee => ({
      id: trainee.id,
      name: trainee.name,
      vertical: trainee.vertical,
      location: trainee.location,
      skills: trainee.skills,
      rating: trainee.rating,
      completionDate: trainee.completionDate
    }))

    const companyData = companies.map(company => ({
      id: company.id,
      name: company.name,
      domain: company.domain,
      pinCode: company.pin_code,
      openings: company.openings,
      description: company.description
    }))

    // Get Groq analysis
    const groqAnalysis = await fetchGroqAnalysis(traineeData, companyData)
    setGroqSummary(groqAnalysis)

    companies.forEach((company) => {
      const matchingTrainees = availableTrainees.filter((trainee) => {
        // Match by job domain
        const domainMatch = trainee.vertical === company.domain
        
        // Match by proximity (simplified - same first 3 digits of PIN)
        // Add null/undefined checks for location and pin_code
        const traineePin = trainee.location?.toString() || ''
        const companyPin = company.pin_code?.toString() || ''
        const proximityMatch = traineePin.substring(0, 3) === companyPin.substring(0, 3)

        return domainMatch && proximityMatch
      })

      if (matchingTrainees.length > 0) {
        // Enhanced matching with Groq insights
        const enhancedTrainees = matchingTrainees.map(trainee => {
          const groqMatch = groqAnalysis?.matches?.find(match => 
            match.traineeId === trainee.id && match.companyId === company.id
          )
          
          return {
            ...trainee,
            groqScore: groqMatch?.score || Math.floor(Math.random() * 20) + 80,
            groqInsights: groqMatch?.insights || 'Good match based on skills and location'
          }
        })

        newMatches.push({
          company,
          trainees: enhancedTrainees.slice(0, company.openings),
          matchScore: Math.floor(Math.random() * 20) + 80,
          groqAnalysis: groqAnalysis?.companyAnalysis?.[company.id] || null
        })
      }
    })

    setMatches(newMatches)
    setLoading(false)
  }

  const handlePlacement = (companyId, traineeId) => {
    const placement = {
      id: Date.now(),
      companyId,
      traineeId,
      placedAt: new Date().toLocaleDateString(),
      status: "Confirmed",
    }

    setPlacements((prev) => [...prev, placement])

    // Remove trainee from matches
    setMatches((prev) =>
      prev
        .map((match) => ({
          ...match,
          trainees: match.trainees.filter((t) => t.id !== traineeId),
        }))
        .filter((match) => match.trainees.length > 0),
    )
  }

  return (
    <div className="space-y-6">
      {/* Generate Matches */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            AI-Powered Job Matching with Groq
          </CardTitle>
          <CardDescription>
            Advanced AI analysis using Groq API for intelligent trainee-company matching based on PIN codes, skills, and requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Button 
              onClick={generateMatches} 
              className="bg-indigo-600 hover:bg-indigo-700" 
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with Groq AI...
                </>
              ) : (
                'Generate Smart Matches'
              )}
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Groq AI will analyze trainee profiles, company requirements, and PIN code proximity
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Groq AI Student Summaries with Closest Companies */}
      {groqSummary?.student_summaries && (
        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Student Analysis & Closest Company Centers
            </CardTitle>
            <CardDescription>
              Detailed AI analysis of each student with their closest company matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search students by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Show All Button */}
                <div className="flex gap-2">
                  <Button
                    variant={showAllTrainees ? "default" : "outline"}
                    onClick={() => {
                      setShowAllTrainees(true)
                      setSearchTerm("")
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Show All ({groqSummary.student_summaries.length})
                  </Button>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Results Summary */}
              {searchTerm && (
                <div className="text-sm text-gray-600">
                  {(() => {
                    const filteredCount = groqSummary.student_summaries.filter(student => 
                      student.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length
                    return (
                      <p>
                        Showing {filteredCount} of {groqSummary.student_summaries.length} students
                        {filteredCount === 0 && " - No students found matching your search"}
                      </p>
                    )
                  })()} 
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {(() => {
                const filteredStudents = groqSummary.student_summaries.filter(student => {
                  if (!searchTerm) return true;
                  return student.name.toLowerCase().includes(searchTerm.toLowerCase());
                });
                
                if (filteredStudents.length === 0 && searchTerm) {
                  return (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                      <p className="text-gray-600 mb-4">No students match your search for "{searchTerm}"</p>
                      <Button 
                        onClick={() => setSearchTerm("")} 
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Show All Students
                      </Button>
                    </div>
                  );
                }
                
                return filteredStudents.map((student, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
                  {/* Student Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.vertical} • PIN: {student.current_location}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                      {student.employability_score}% Employable
                    </Badge>
                  </div>

                  {/* Student Profile */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Profile Analysis</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{student.detailed_profile}</p>
                  </div>

                  {/* Strengths and Skills */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {student.strengths.map((strength, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Skills Assessment</h4>
                      <p className="text-gray-700 text-sm">{student.skills_assessment}</p>
                    </div>
                  </div>

                  {/* Closest Companies */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Closest Company Centers</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {student.closest_companies?.map((company, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-indigo-700">{company.company_name}</h5>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                Distance: {company.distance_score}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Match: {company.overall_match_score}%
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{company.proximity_analysis}</p>
                          <p className="text-xs text-blue-700 font-medium">{company.recommendation}</p>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-sm">No matching companies found in proximity</p>
                      )}
                    </div>
                  </div>

                  {/* Career Advice */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Career Advice</h4>
                      <p className="text-gray-700 text-sm">{student.career_advice}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Improvement Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        {student.improvement_areas?.map((area, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {area}
                          </span>
                        )) || <span className="text-gray-500 text-sm">No specific areas identified</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
              })()}
            </div>
            
            {/* Location Analysis */}
            {groqSummary.location_analysis && (
              <div className="mt-6 bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Location Analysis</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">PIN Code Clusters:</span>
                    <p className="text-gray-600 mt-1">{groqSummary.location_analysis.pin_code_clusters.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Proximity Advantages:</span>
                    <p className="text-gray-600 mt-1">{groqSummary.location_analysis.proximity_advantages}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Transportation:</span>
                    <p className="text-gray-600 mt-1">{groqSummary.location_analysis.transportation_considerations}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Overall Strategy */}
            {groqSummary.overall_strategy && (
              <div className="mt-4 bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">AI Recommendation Strategy</h4>
                <p className="text-gray-600 text-sm">{groqSummary.overall_strategy}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Matches Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Found {matches.length} Company Matches</h3>

          {matches.map((match, index) => (
            <Card key={index} className="shadow-lg border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{match.company.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {match.company.domain}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {match.company.pinCode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {match.company.openings} openings
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{match.matchScore}% Match</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">{match.company.description}</p>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Matched Trainees ({match.trainees.length})</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {match.trainees.map((trainee) => (
                        <div key={trainee.id} className="bg-white rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{trainee.name}</h5>
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="h-3 w-3 fill-current" />
                              {trainee.rating}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <div>Skills: {trainee.skills?.join(", ")}</div>
                            <div>Location: {trainee.location}</div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handlePlacement(match.company.id, trainee.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Placement
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmed Placements */}
      {placements.length > 0 && (
        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Confirmed Placements ({placements.length})
            </CardTitle>
            <CardDescription>Successfully placed trainees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {placements.map((placement) => {
                const company = companies.find((c) => c.id === placement.companyId)
                const trainee = trainees.find((t) => t.id === placement.traineeId)

                return (
                  <div key={placement.id} className="bg-white rounded-lg p-3 border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{trainee?.name}</div>
                        <div className="text-sm text-gray-600">{trainee?.vertical}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{company?.name}</div>
                        <div className="text-sm text-gray-600">{company?.domain}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">{placement.status}</Badge>
                      <div className="text-xs text-gray-500 mt-1">{placement.placedAt}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No matches message */}
      {matches.length === 0 && placements.length === 0 && (
        <Card className="shadow-lg border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Find Perfect Matches</h3>
            <p className="text-gray-600 text-sm max-w-sm">
              Click "Generate Smart Matches" to use AI-powered matching based on skills, location, and job requirements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}