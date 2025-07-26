"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { AttendanceTracker } from "@/components/attendance-tracker"
import { EvaluationModule } from "@/components/evaluation-module"
import { TrainerAnalytics } from "@/components/trainer-analytics"
import { Users, ClipboardCheck, BarChart3, Calendar, Award } from "lucide-react"

export default function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState("attendance")
  const [loading, setLoading] = useState(true) // Set to true to show loading while fetching
  const [trainees, setTrainees] = useState([]) // Dynamic trainee data from API

  // Static attendance percentages - these never change
  const staticAttendanceData = {
    0: { attendance: 85, phone: "+91-9876543210", vertical: "Beauty & Wellness" },
    1: { attendance: 90, phone: "+91-9876543211", vertical: "Construction" },
    2: { attendance: 93, phone: "+91-9876543212", vertical: "Welding" },
    3: { attendance: 60, phone: "+91-9876543213", vertical: "Copywriting" },
    4: { attendance: 64, phone: "+91-9876543214", vertical: "Beauty & Wellness" },
    5: { attendance: 94, phone: "+91-9876543215", vertical: "Construction" },
    6: { attendance: 68, phone: "+91-9876543216", vertical: "Welding" },
    7: { attendance: 75, phone: "+91-9876543217", vertical: "Copywriting" },
  }

  // Fetch trainees from backend
  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trainees");
        if (response.ok) {
          const traineeData = await response.json();

          // Combine API data with static data
          const combinedData = traineeData.map((trainee, index) => ({
            id: trainee.id.toString(),
            name: trainee.name,
            phone: staticAttendanceData[index]?.phone || "+91-9876543200",
            vertical: staticAttendanceData[index]?.vertical || "General",
            attendance: staticAttendanceData[index]?.attendance || 85,
            skillRating: 4.0 + (index * 0.1), // Static skill ratings
            projectsCompleted: 2 + index,
            assessmentScore: staticAttendanceData[index]?.attendance || 85, // Use same as attendance
            practicalScore: 80 + (index * 2),
            theoryScore: 85 + (index * 1)
          }));

          setTrainees(combinedData);
        } else {
          console.error("Failed to fetch trainees");
          // Fallback to empty array
          setTrainees([]);
        }
      } catch (error) {
        console.error("Error fetching trainees:", error);
        // Fallback to empty array
        setTrainees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainees();
  }, [])

  // OTP state and timer - using useEffect only for OTP
  const [otp, setOtp] = useState(null)
  const [countdown, setCountdown] = useState(10)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  // useEffect ONLY for OTP - individual performance remains static
  useEffect(() => {
    // Fetch initial OTP
    const fetchOtp = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/otp");
        if (response.ok) {
          const data = await response.json();
          setOtp(data.otp);
          setCountdown(10); // Reset countdown when new OTP is fetched
        }
      } catch (error) {
        console.error("Error fetching OTP:", error);
      }
    };

    // Fetch OTP immediately
    fetchOtp();

    // Set up polling to fetch new OTP every 10 seconds
    const otpInterval = setInterval(fetchOtp, 10000);

    // Set up countdown timer (updates every second)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 10; // Reset to 10 when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(otpInterval);
      clearInterval(countdownInterval);
    };
  }, [])

  // Static - individual performance data never changes

  // Static batch information with dynamic trainee count
  const batchInfo = {
    name: "Batch 2024-A",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    totalTrainees: trainees.length, // Dynamic count based on actual trainees
    avgAttendance: 89, // Static average attendance
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Trainer Dashboard" role="Trainer" />
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading trainees from database...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23fed7aa fillOpacity=0.2%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10">
        <Header title="Trainer Dashboard" role="Trainer" />

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                Training Management Hub
              </h2>
              <p className="text-gray-600 text-lg">Manage attendance, evaluations, and track progress</p>
            </div>
          </div>

          {/* Enhanced Batch Overview */}
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6 text-orange-500" />
                {batchInfo.name} Overview
              </CardTitle>
              <CardDescription className="text-base">
                Training Period: {new Date(batchInfo.startDate).toLocaleDateString()} -{" "}
                {new Date(batchInfo.endDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 shadow-md">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full w-fit mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{batchInfo.totalTrainees}</div>
                  <div className="text-sm text-gray-600 font-medium">Total Trainees</div>
                </div>
                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-md">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full w-fit mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{batchInfo.avgAttendance}%</div>
                  <div className="text-sm text-gray-600 font-medium">Avg Attendance</div>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 shadow-md">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-3 rounded-full w-fit mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">4</div>
                  <div className="text-sm text-gray-600 font-medium">Job Verticals</div>
                </div>
                <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 shadow-md">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full w-fit mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600 font-medium">Weeks Left</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Main Tabs */}
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up delay-100">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500/5 to-amber-500/5 p-6 rounded-t-lg">
                <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-1">
                  <TabsTrigger
                    value="attendance"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                  >
                    <Users className="h-4 w-4" />
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger
                    value="evaluation"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Evaluation
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="attendance">
                <div className="space-y-6">
                  {/* OTP Display */}
                  <Card className="shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-6xl font-bold text-indigo-700 mb-4">
                          {otp ?? "----"}
                        </div>
                        <div className="mb-2 text-gray-600">
                          New OTP in: <span className="font-bold">{countdown}s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attendance Tracker */}
                  <AttendanceTracker trainees={trainees} />
                </div>
              </TabsContent>

              <TabsContent value="evaluation" className="mt-0">
                <EvaluationModule trainees={trainees} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <TrainerAnalytics trainees={trainees} />
              </TabsContent>
            </Tabs>
          </Card>
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
      `}</style>
    </div >
  )
}
