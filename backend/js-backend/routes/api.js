const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Prompt builder function
function buildRecommendationPrompt(user) {
  return `
You are a vocational counselor. Suggest the top 3 suitable vocational fields for the following person. Include short reasoning for each suggestion.

Candidate Profile:
- Educational Qualification: ${user.education}
- Previous Experience: ${user.experience}
- Gender: ${user.gender}
- Physical Disability: ${user.disability}
- Sole Earner: ${user.soleEarner}
- English Language Proficiency: ${user.english}
- Personal Preference: ${user.preference}

Respond in JSON format:
		[
			{
				"vertical": A vertical of vocational skill 
				"confidence": A confidence in the prediction, which is an integer
				"justification": A single line justification for the role
				"duration": Give a duration of the course from one of the following options
			}
		]
`;
}

system_prompt = `You are a helpful AI agent

You are being used in an organisation that that aims to help unemployed people from marginalised communities get employment with vocational skills. 
The organisation offers career options in Beauty, Welding, Copywriting and Construction. 
If you are to provide any justification to the person as to why they have to take a career option recommended to them by the organisation, then do not hesistate to provide justification points. 
Do not mention coercion in the response.
If asked to give a job recommendation based on a user profile, assess the profile details and provide a final recommendation from one of the following verticals: Beauty, Construction, Welding, Copywriting
When asked to give JSON output, give the output in a valid JSON format that is parseable by any program into a proper response. 
Do not use \` character in the response. `;

// POST /recommend
// router.post('/recommend', async (req, res) => {
//     const user = req.body;
//     console.log("Received user data:", user);
//     const prompt = buildRecommendationPrompt(user);
router.post("/recommend", async (req, res) => {
  const user = req.body;
  console.log("Received user data:", user);
  const prompt = buildRecommendationPrompt(user);

//     try {
//         const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

//         const result = await model.generateContent(prompt, requestOptions = {system_prompt: system_prompt});
//         const response = await result.response;
//         const text = response.text();
    const result = await model.generateContent(prompt, (requestOptions = { system_prompt: system_prompt }));
    const response = await result.response;
    const text = response.text();

//         res.json(text);
//     } catch (error) {
//         console.error("Gemini error:", error.message);
//         res.status(500).json({ error: 'Failed to get response from Gemini' });
//     }
// });

    res.json({ suggestions: text });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

function buildJustificationPrompt(user) {
  return `
Given a person's qualifications are \n%s\n and the recommended job is %s, 
	can you provide me with some justifications as to why the person must take up the job, provide these points in bullet points in the following format. 
	1. Reason
	2. Reason
	3. Reason 
	and so on
`;
}

// router.post("/justify", async (req, res) => {
//   const user = req.body;
//   console.log("Received user data:", user);
//   const prompt = buildJustificationPrompt(user);

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

//     const result = await model.generateContent(prompt, (requestOptions = { system_prompt: system_prompt }));
//     const response = await result.response;
//     const text = response.text();

//         res.json(text);
//     } catch (error) {
//         console.error("Gemini error:", error.message);
//         res.status(500).json({ error: 'Failed to get response from Gemini' });
//     }
//     res.json(text);
//   } catch (error) {
//     console.error("Gemini error:", error.message);
//     res.status(500).json({ error: "Failed to get response from Gemini" });
//   }
// });

router.post('/recommend', async (req, res) => {
	const {
		education,
		previous_experience,
		gender,
		physical_disability,
		sole_earner,
		english_language_preference,
		personal_preference
	} = req.body;

	const prompt = `
		You are a vocational counselor. Suggest the top 3 suitable vocational fields for the following person. Include short reasoning for the suggestion.
		Candidate Profile:
		* Educational Qualification: ${education}, 
		* Previous Experience: ${previous_experience}, 
		* Gender: ${gender}, 
		* Physical Disability: ${physical_disability}, 
		* Sole Earner: ${sole_earner}, 
		* English Language Proficiency: ${english_language_preference}, 
		* Personal Preference: ${personal_preference}, 
		Respond in JSON format:
		[
			{
				"vertical": A vertical of vocational skill,
				"confidence": A confidence in the prediction, which is an integer,
				"justification": A single line justification for the role,
				"duration": Give a duration of the course from one of the following options
			}
		]
	`;

	const { exec } = require('child_process');
	exec(`python3 main.py "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
		if (error) {
			res.status(500).json({ error: "error engaging LLM", details: error.message });
			return;
		}

		let outputString = stdout.replace(/```json/g, '').replace(/```/g, '');

		let recommendations;
		try {
			recommendations = JSON.parse(outputString);
		} catch (err) {
			res.status(500).json({ error: "Error unmarshalling LLM output", details: err.message });
			return;
		}

		res.status(200).json(recommendations);
	});
});


module.exports = router;
