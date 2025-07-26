"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target } from "lucide-react"

export function AdminAnalytics({ batchData }) {
  // Mock detailed analytics data
  const performanceMetrics = [
    { metric: "Attendance Rate", value: 87, target: 85, color: "bg-green-500" },
    { metric: "Skill Assessment", value: 78, target: 80, color: "bg-yellow-500" },
    { metric: "Completion Rate", value: 92, target: 90, color: "bg-green-500" },
    { metric: "Placement Rate", value: 85, target: 80, color: "bg-green-500" },
  ]

  const weeklyProgress = [
    { week: "Week 1", completed: 15, target: 20 },
    { week: "Week 2", completed: 18, target: 20 },
    { week: "Week 3", completed: 22, target: 20 },
    { week: "Week 4", completed: 19, target: 20 },
    { week: "Week 5", completed: 25, target: 20 },
    { week: "Week 6", completed: 23, target: 20 },
  ]

  const skillDistribution = [
    { skill: "Technical Skills", trainees: 12, percentage: 48 },
    { skill: "Communication", trainees: 8, percentage: 32 },
    { skill: "Leadership", trainees: 3, percentage: 12 },
    { skill: "Problem Solving", trainees: 2, percentage: 8 },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance Metrics */}
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Performance vs Targets
          </CardTitle>
          <CardDescription>Key metrics compared to set targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {performanceMetrics.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Target: {item.target}%</span>
                    <span
                      className={`text-sm font-bold ${item.value >= item.target ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.value}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {item.value >= item.target ? "✅ Target Met" : "⚠️ Below Target"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Distribution */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Top Skills
          </CardTitle>
          <CardDescription>Most developed skills in batch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skillDistribution.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-gray-600">{item.trainees} trainees</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card className="shadow-lg lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Weekly Progress Tracking
          </CardTitle>
          <CardDescription>Modules completed vs weekly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-6 gap-4">
            {weeklyProgress.map((item, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-sm font-medium text-gray-700">{item.week}</div>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        item.completed >= item.target ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {item.completed}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: {item.target}</div>
                </div>
                <div
                  className={`text-xs font-medium ${
                    item.completed >= item.target ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {item.completed >= item.target ? "On Track" : "Behind"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
