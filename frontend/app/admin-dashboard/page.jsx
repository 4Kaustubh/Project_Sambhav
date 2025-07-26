"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { AdminAnalytics } from "@/components/admin-analytics"
import { MapPin, Users, Building, ChevronRight, BarChart3, Target } from "lucide-react"

export default function AdminDashboard() {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)

  // Mock data
  const regions = [
    {
      id: 1,
      name: "Delhi NCR",
      centers: 8,
      totalTrainees: 450,
      activeBatches: 12,
      completionRate: 89,
      batches: [
        { id: 1, name: "Batch 2024-A", trainer: "Rajesh Kumar", trainees: 25, progress: 75 },
        { id: 2, name: "Batch 2024-B", trainer: "Priya Singh", trainees: 30, progress: 60 },
        { id: 3, name: "Batch 2024-C", trainer: "Amit Sharma", trainees: 28, progress: 90 },
      ],
    },
    {
      id: 2,
      name: "Mumbai",
      centers: 6,
      totalTrainees: 380,
      activeBatches: 10,
      completionRate: 92,
      batches: [
        { id: 4, name: "Batch 2024-D", trainer: "Sunita Patel", trainees: 22, progress: 85 },
        { id: 5, name: "Batch 2024-E", trainer: "Vikram Joshi", trainees: 26, progress: 70 },
      ],
    },
    {
      id: 3,
      name: "Bangalore",
      centers: 5,
      totalTrainees: 320,
      activeBatches: 8,
      completionRate: 87,
      batches: [
        { id: 6, name: "Batch 2024-F", trainer: "Lakshmi Rao", trainees: 24, progress: 95 },
        { id: 7, name: "Batch 2024-G", trainer: "Kiran Kumar", trainees: 29, progress: 55 },
      ],
    },
  ]

  const overallStats = {
    totalRegions: regions.length,
    totalCenters: regions.reduce((sum, region) => sum + region.centers, 0),
    totalTrainees: regions.reduce((sum, region) => sum + region.totalTrainees, 0),
    totalBatches: regions.reduce((sum, region) => sum + region.activeBatches, 0),
    avgCompletion: Math.round(regions.reduce((sum, region) => sum + region.completionRate, 0) / regions.length),
  }

  const handleRegionClick = (region) => {
    setSelectedRegion(region)
    setSelectedBatch(null)
  }

  const handleBatchClick = (batch) => {
    setSelectedBatch(batch)
  }

  const handleBackToRegions = () => {
    setSelectedRegion(null)
    setSelectedBatch(null)
  }

  const handleBackToBatches = () => {
    setSelectedBatch(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23fed7aa fillOpacity=0.2%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10">
        <Header title="Admin Dashboard" role="Admin" />

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                Administrative Control Center
              </h2>
              <p className="text-gray-600 text-lg">Monitor regions, batches, and overall performance</p>
            </div>
          </div>

          {/* Enhanced Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-slide-up">
            <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full w-fit mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{overallStats.totalRegions}</div>
                <div className=" text-sm text-gray-600 font-medium">Regions</div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-3 rounded-full w-fit mx-auto mb-3">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{overallStats.totalCenters}</div>
                <div className="text-sm text-gray-600 font-medium">Centers</div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{overallStats.totalTrainees}</div>
                <div className="text-sm text-gray-600 font-medium">Trainees</div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full w-fit mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{overallStats.totalBatches}</div>
                <div className="text-sm text-gray-600 font-medium">Active Batches</div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full w-fit mx-auto mb-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{overallStats.avgCompletion}%</div>
                <div className="text-sm text-gray-600 font-medium">Avg Completion</div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Navigation Breadcrumb */}
          <Card className="shadow-lg border-0 backdrop-blur-sm bg-white/95 animate-slide-up delay-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm">
                <button
                  onClick={handleBackToRegions}
                  className={`px-3 py-1 rounded-lg transition-colors ${!selectedRegion ? "bg-orange-100 text-orange-700 font-medium" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
                >
                  Regions
                </button>
                {selectedRegion && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <button
                      onClick={handleBackToBatches}
                      className={`px-3 py-1 rounded-lg transition-colors ${!selectedBatch ? "bg-orange-100 text-orange-700 font-medium" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"}`}
                    >
                      {selectedRegion.name}
                    </button>
                  </>
                )}
                {selectedBatch && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 font-medium rounded-lg">
                      {selectedBatch.name}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          {!selectedRegion ? (
            /* Enhanced Regions View */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up delay-200">
              {regions.map((region) => (
                <Card
                  key={region.id}
                  className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => handleRegionClick(region)}
                >
                  <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>{region.name}</span>
                      <ChevronRight className="h-5 w-5 text-orange-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-orange-600">{region.centers}</div>
                        <div className="text-xs text-gray-600">Centers</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">{region.totalTrainees}</div>
                        <div className="text-xs text-gray-600">Trainees</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-600">{region.activeBatches}</div>
                        <div className="text-xs text-gray-600">Active Batches</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">{region.completionRate}%</div>
                        <div className="text-xs text-gray-600">Completion</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !selectedBatch ? (
            /* Enhanced Batches View */
            <div className="space-y-6 animate-slide-up delay-200">
              <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
                <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
                  <CardTitle className="text-xl">{selectedRegion.name} - Batch Overview</CardTitle>
                  <CardDescription className="text-base">
                    {selectedRegion.activeBatches} active batches across {selectedRegion.centers} training centers
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedRegion.batches.map((batch) => (
                  <Card
                    key={batch.id}
                    className="shadow-xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => handleBatchClick(batch)}
                  >
                    <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>{batch.name}</span>
                        <ChevronRight className="h-5 w-5 text-orange-500" />
                      </CardTitle>
                      <CardDescription>Trainer: {batch.trainer}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">Trainees</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {batch.trainees}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Progress</span>
                          <span className="text-sm font-bold text-orange-600">{batch.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${batch.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Enhanced Batch Details View */
            <div className="space-y-6 animate-slide-up delay-200">
              <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
                <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
                  <CardTitle className="text-xl">{selectedBatch.name} Details</CardTitle>
                  <CardDescription className="text-base">
                    Trainer: {selectedBatch.trainer} | {selectedBatch.trainees} Trainees | {selectedBatch.progress}%
                    Complete
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-600">{selectedBatch.trainees}</div>
                      <div className="text-sm text-gray-600 font-medium">Total Trainees</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-gray-600 font-medium">Avg Attendance</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-600">4.2</div>
                      <div className="text-sm text-gray-600 font-medium">Avg Rating</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600 font-medium">Weeks Left</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AdminAnalytics batchData={selectedBatch} />
            </div>
          )}
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
