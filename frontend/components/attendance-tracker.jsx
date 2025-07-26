"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, CheckCircle, Clock } from "lucide-react"

export function AttendanceTracker({ trainees }) {
  const [attendanceData, setAttendanceData] = useState({})

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return "text-green-600"
    if (attendance >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          Daily Attendance Tracker
        </CardTitle>
        <CardDescription>Monitor trainee attendance status and overall performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainees.map((trainee) => {
            const attendance = attendanceData[trainee.id]

            return (
              <div key={trainee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{trainee.name}</h3>
                      <Badge variant="outline">{trainee.vertical}</Badge>
                      {attendance?.status === "present" && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Present
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {trainee.phone}
                      </div>
                      <div className={`font-medium ${getAttendanceColor(trainee.attendance)}`}>
                        Overall: {trainee.attendance}%
                      </div>
                      {attendance?.timestamp && <div className="text-green-600">Marked at: {attendance.timestamp}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">IVR System Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Trainees call the IVR system directly using their registered phone numbers</li>
            <li>• System asks trainees to provide the current 4-digit OTP (displayed above)</li>
            <li>• Attendance is marked automatically when correct OTP is provided via IVR</li>
            <li>• OTP changes every 10 seconds for security</li>
            <li>• 🤖 Current OTP is shown in the main dashboard for reference</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
