"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Download, FileText } from "lucide-react"
import axios from "axios"


export function EvaluationModule({ trainees }) {
  const [selectedTrainee, setSelectedTrainee] = useState(null)
  const [evaluationData, setEvaluationData] = useState({})
  const [evaluations, setEvaluations] = useState({})

  const evaluationCriteria = {
    "Beauty & Wellness": [
      { name: "Technical Skills", weight: 30 },
      { name: "Customer Service", weight: 25 },
      { name: "Hygiene & Safety", weight: 20 },
      { name: "Communication", weight: 15 },
      { name: "Punctuality", weight: 10 },
    ],
    Construction: [
      { name: "Technical Skills", weight: 35 },
      { name: "Safety Protocols", weight: 30 },
      { name: "Teamwork", weight: 20 },
      { name: "Physical Fitness", weight: 10 },
      { name: "Punctuality", weight: 5 },
    ],
    Copywriting: [
      { name: "Writing Quality", weight: 40 },
      { name: "Creativity", weight: 25 },
      { name: "Research Skills", weight: 15 },
      { name: "Meeting Deadlines", weight: 15 },
      { name: "Client Communication", weight: 5 },
    ],
    Welding: [
      { name: "Technical Skills", weight: 40 },
      { name: "Safety Protocols", weight: 30 },
      { name: "Quality Control", weight: 20 },
      { name: "Equipment Handling", weight: 10 },
    ],
  }

  const handleEvaluationSubmit = async (traineeId) => {
    const data = evaluationData[traineeId]
    if (!data) return

    const criteria = evaluationCriteria[selectedTrainee.vertical] || []
    let totalScore = 0
    let totalWeight = 0

    criteria.forEach((criterion) => {
      const score = Number.parseInt(data[criterion.name]) || 0
      totalScore += score * criterion.weight
      totalWeight += criterion.weight
    })

    const finalScore = Math.round(totalScore / totalWeight)

    // Prepare data for backend
    const evaluationPayload = {
      trainee_id: traineeId,
      evaluator_id: "11111111-aaaa-4aaa-bbbb-aaaaaaaaaaaa", // Valid trainer UUID from database
      score: finalScore,
      recommendation: data.recommendation,
      comments: data.comments || ""
    };

    try {
      // Send evaluation to backend
      const response = await fetch("http://localhost:5000/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluationPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Evaluation saved to backend:", result);

        // Update local state
        setEvaluations((prev) => ({
          ...prev,
          [traineeId]: {
            ...data,
            finalScore,
            evaluatedAt: new Date().toLocaleDateString(),
            criteria: criteria.map((c) => ({
              ...c,
              score: Number.parseInt(data[c.name]) || 0,
            })),
          },
        }));

        // Reset form
        setEvaluationData((prev) => ({ ...prev, [traineeId]: {} }));
        setSelectedTrainee(null);

        // Fetch updated evaluations
        fetchEvaluations();
      } else {
        const errorData = await response.json();
        alert("Failed to save evaluation: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving evaluation:", error);
      alert("Network error while saving evaluation. Please try again.");
    }
  }

  const handleInputChange = (traineeId, field, value) => {
    setEvaluationData((prev) => ({
      ...prev,
      [traineeId]: {
        ...prev[traineeId],
        [field]: value,
      },
    }))
  }

  const generateReport = async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate-report", { evaluations }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trainee_report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Report generation error:", error);
      alert("Failed to download PDF report");
    }
  };

  // Fetch existing evaluations from backend
  const fetchEvaluations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/evaluations");
      if (response.ok) {
        const data = await response.json();
        // Convert backend data to frontend format
        const evaluationsMap = {};
        data.forEach(evaluation => {
          evaluationsMap[evaluation.trainee_id] = {
            finalScore: evaluation.score,
            recommendation: evaluation.recommendation,
            comments: evaluation.comments,
            evaluatedAt: new Date(evaluation.evaluated_at).toLocaleDateString(),
          };
        });
        setEvaluations(evaluationsMap);
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  // Load evaluations when component mounts
  useEffect(() => {
    fetchEvaluations();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      {/* Evaluation Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                Trainee Evaluation
              </CardTitle>
              <CardDescription>Evaluate trainees based on their job vertical criteria</CardDescription>
            </div>
            <Button onClick={generateReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedTrainee ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainees.map((trainee) => {
                const evaluation = evaluations[trainee.id]
                return (
                  <Card
                    key={trainee.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${evaluation ? "border-green-200 bg-green-50" : ""}`}
                    onClick={() => !evaluation && setSelectedTrainee(trainee)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{trainee.name}</h3>
                        {evaluation ? (
                          <Badge
                            className={
                              evaluation.recommendation === "ready"
                                ? "bg-green-100 text-green-800"
                                : evaluation.recommendation === "additional"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-orange-100 text-orange-800"
                            }
                          >
                            {evaluation.recommendation === "ready"
                              ? "Ready for Placement"
                              : evaluation.recommendation === "additional"
                                ? "Additional Training"
                                : "Reassess in 2 Weeks"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>{trainee.vertical}</div>
                        <div>Attendance: {trainee.attendance}%</div>
                        {evaluation && (
                          <div className="flex justify-between items-center">
                            <span className="text-green-600">Evaluated on {evaluation.evaluatedAt}</span>
                            <span className={`font-medium ${getScoreColor(evaluation.finalScore)}`}>
                              {evaluation.finalScore}/100
                            </span>
                          </div>
                        )}
                      </div>
                      {!evaluation && (
                        <Button size="sm" className="w-full mt-3">
                          Evaluate
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Evaluating: {selectedTrainee.name}</h3>
                  <p className="text-gray-600">{selectedTrainee.vertical}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedTrainee(null)}>
                  Back to List
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Evaluation Criteria</h4>
                  {evaluationCriteria[selectedTrainee.vertical]?.map((criterion) => (
                    <div key={criterion.name} className="space-y-2">
                      <Label className="flex items-center justify-between">
                        <span>{criterion.name}</span>
                        <span className="text-sm text-gray-500">({criterion.weight}%)</span>
                      </Label>
                      <Select
                        value={evaluationData[selectedTrainee.id]?.[criterion.name] || ""}
                        onValueChange={(value) => handleInputChange(selectedTrainee.id, criterion.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select score (1-10)" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}{" "}
                              {i + 1 <= 3 ? "(Poor)" : i + 1 <= 6 ? "(Average)" : i + 1 <= 8 ? "(Good)" : "(Excellent)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Additional Comments</h4>
                  <Textarea
                    placeholder="Enter detailed feedback and recommendations..."
                    rows={6}
                    value={evaluationData[selectedTrainee.id]?.comments || ""}
                    onChange={(e) => handleInputChange(selectedTrainee.id, "comments", e.target.value)}
                  />

                  <div className="space-y-2">
                    <Label>Overall Recommendation</Label>
                    <Select
                      value={evaluationData[selectedTrainee.id]?.recommendation || ""}
                      onValueChange={(value) => handleInputChange(selectedTrainee.id, "recommendation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recommendation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready">Ready for Placement</SelectItem>
                        <SelectItem value="additional">Needs Additional Training</SelectItem>
                        <SelectItem value="reassess">Reassess in 2 Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => handleEvaluationSubmit(selectedTrainee.id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Submit Evaluation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Evaluations */}
      {Object.keys(evaluations).length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Completed Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(evaluations).map(([traineeId, evaluation]) => {
                const trainee = trainees.find((t) => t.id === Number.parseInt(traineeId))
                return (
                  <div key={traineeId} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{trainee?.name}</h3>
                        <p className="text-sm text-gray-600">{trainee?.vertical}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(evaluation.finalScore)}`}>
                          {evaluation.finalScore}/100
                        </div>
                        <div className="text-sm text-gray-600">Final Score</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Criteria Scores:</h4>
                        <div className="space-y-1">
                          {evaluation.criteria?.map((criterion, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{criterion.name}:</span>
                              <span className="font-medium">{criterion.score}/10</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendation:</h4>
                        <Badge
                          className={
                            evaluation.recommendation === "ready"
                              ? "bg-green-100 text-green-800"
                              : evaluation.recommendation === "additional"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                          }
                        >
                          {evaluation.recommendation === "ready"
                            ? "Ready for Placement"
                            : evaluation.recommendation === "additional"
                              ? "Needs Additional Training"
                              : "Reassess in 2 Weeks"}
                        </Badge>
                      </div>
                    </div>

                    {evaluation.comments && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Comments:</h4>
                        <p className="text-sm text-gray-700">{evaluation.comments}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}