"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, TrendingUp } from "lucide-react"
import { IndividualPerformance } from "./individual-performance"

export function TrainerAnalytics({ trainees }) {

  const attendanceData = [
    { week: "Week 1", attendance: 85 },
    { week: "Week 2", attendance: 88 },
    { week: "Week 3", attendance: 82 },
    { week: "Week 4", attendance: 90 },
    { week: "Week 5", attendance: 87 },
    { week: "Week 6", attendance: 92 },
  ]

  const verticalDistribution = trainees.reduce((acc, trainee) => {
    acc[trainee.vertical] = (acc[trainee.vertical] || 0) + 1
    return acc
  }, {})

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Individual Performance Component */}
      <IndividualPerformance />

      {/* Attendance Trend Line Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Attendance Trend
          </CardTitle>
          <CardDescription>Weekly attendance percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.week}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.attendance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-10">{item.attendance}%</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm font-medium">
                <span>Average:</span>
                <span className="text-green-600">
                  {Math.round(attendanceData.reduce((sum, item) => sum + item.attendance, 0) / attendanceData.length)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Vertical Distribution Pie Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Job Vertical Distribution
          </CardTitle>
          <CardDescription>Trainees by job category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(verticalDistribution).map(([vertical, count], index) => {
              const percentage = Math.round((count / trainees.length) * 100)
              const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"]
              return (
                <div key={vertical} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{vertical}</span>
                    <span className="text-gray-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
