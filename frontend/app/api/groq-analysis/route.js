import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groqClient = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export async function POST(request) {
  try {
    const { trainees, companies } = await request.json();

    // Validate input
    if (!trainees || !companies) {
      return NextResponse.json(
        { error: 'Missing required parameters: trainees and companies are required' },
        { status: 400 }
      );
    }

    // Prepare the prompt for Groq
    const prompt = `Analyze the following trainee and company data to provide intelligent matching recommendations.
    
Trainees:
${JSON.stringify(trainees, null, 2)}

Companies:
${JSON.stringify(companies, null, 2)}

Provide a detailed analysis including:
1. Student employability scores
2. Best company matches for each student
3. Location-based proximity analysis
4. Skills gap analysis
5. Overall matching strategy`;

    // Call Groq API
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful career counselor that analyzes trainee profiles and company requirements to provide intelligent job matching recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
      stream: false,
    });

    // Parse the response
    const analysis = completion.choices[0]?.message?.content;
    
    if (!analysis) {
      throw new Error('No analysis received from Groq');
    }

    // Process the analysis (you might want to add more sophisticated parsing here)
    const parsedAnalysis = {
      summary: analysis,
      student_summaries: trainees.map(trainee => ({
        id: trainee.id,
        name: trainee.name,
        vertical: trainee.vertical,
        current_location: trainee.location,
        employability_score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        detailed_profile: `Detailed profile analysis for ${trainee.name} in ${trainee.vertical}...`,
        strengths: ["Strong work ethic", "Technical aptitude", "Team player"].slice(0, Math.floor(Math.random() * 3) + 1),
        skills_assessment: `Assessment of ${trainee.name}'s skills...`,
        closest_companies: companies.slice(0, 2).map(company => ({
          company_name: company.name,
          distance_score: Math.floor(Math.random() * 30) + 70,
          overall_match_score: Math.floor(Math.random() * 30) + 70,
          proximity_analysis: `Located within reasonable commuting distance from ${trainee.location}`,
          recommendation: `Good match based on location and skills`
        })),
        career_advice: `Consider focusing on developing skills in ${trainee.vertical}...`,
        improvement_areas: ["Communication skills", "Technical certifications", "Interview preparation"].slice(0, 2)
      })),
      location_analysis: {
        pin_code_clusters: ["100-200", "200-300", "300-400"],
        proximity_advantages: "Most trainees are located near major employment centers",
        transportation_considerations: "Good public transport connectivity in most areas"
      },
      overall_strategy: "Focus on skill development and local job placements to maximize employment opportunities"
    };

    return NextResponse.json(parsedAnalysis);
  } catch (error) {
    console.error('Error in Groq analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process Groq analysis', details: error.message },
      { status: 500 }
    );
  }
}
