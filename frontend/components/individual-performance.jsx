"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export function IndividualPerformance() {
    // Static individual performance data - never changes, no useEffect needed
    const staticPerformanceData = [
        { name: "Amit", score: 85 },
        { name: "Priya", score: 90 },
        { name: "Rahul", score: 93 },
        { name: "Sneha", score: 60 },
        { name: "Vikash", score: 64 },
        { name: "Anita", score: 94 },
        { name: "Ravi", score: 68 },
        { name: "Pooja", score: 75 }
    ]

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    Individual Performance
                </CardTitle>
                <CardDescription>Static skill assessment scores by trainee</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {staticPerformanceData.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-600">{item.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${item.score >= 80 ? "bg-green-500" : item.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                                        }`}
                                    style={{ width: `${item.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Average Performance:</span>
                        <span className="text-indigo-600">
                            {Math.round(staticPerformanceData.reduce((sum, item) => sum + item.score, 0) / staticPerformanceData.length)}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
