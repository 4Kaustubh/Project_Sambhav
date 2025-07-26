package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

func (cfg *apiConfig) GetArguments(w http.ResponseWriter, r *http.Request) {
	type req struct {
		Reccomendation string `json:"recommendation"`
		Data           string `json:"data"`
	}
	var data req
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		respondWithError(w, http.StatusInternalServerError, "error decoding body", err)
		return
	}
	var output bytes.Buffer
	prompt := fmt.Sprintf(`Given a person's qualifications are \n%s\n and the recommended job is %s, 
	can you provide me with some justifications as to why the person must take up the job, provide these points in bullet points in the following format. 
	1. Reason
	2. Reason
	3. Reason 
	and so on`, data.Data, data.Reccomendation)
	// fmt.Println(prompt)
	command := exec.Command("python3", "main.py", prompt)
	command.Stdout = &output
	err := command.Run()
	if err != nil {
		// return fmt.Errorf("error executing summarisation: %v", err)
		respondWithError(w, http.StatusInternalServerError, "error engaging LLM", err)
		return
	}

	// fmt.Println("Summary: ")
	// fmt.Println(output.String())
	// return nil
	respondWithJSON(w, http.StatusOK, output.String())

}

// `
// You are a vocational counselor. Suggest the top 3 suitable vocational fields for the following person. Include short reasoning for each suggestion.

// Candidate Profile:
// •⁠  ⁠Educational Qualification: ${user.education}
// •⁠  ⁠Previous Experience: ${user.experience}
// •⁠  ⁠Gender: ${user.gender}
// •⁠  ⁠Physical Disability: ${user.disability}
// •⁠  ⁠Sole Earner: ${user.soleEarner}
// •⁠  ⁠English Language Proficiency: ${user.english}
// •⁠  ⁠Personal Preference: ${user.preference}

// Respond in a structured way like:
// 1.⁠ ⁠Field
// 2.⁠ ⁠Field
// 3.⁠ ⁠Field
//     `

func (cfg *apiConfig) GetRecommendation(w http.ResponseWriter, r *http.Request) {
	type req struct {
		Education                 string `json:"education"`
		PreviousExperience        string `json:"previous_experience"`
		Gender                    string `json:"gender"`
		PhysicalDisability        string `json:"physical_disability"`
		SoleEarner                string `json:"sole_earner"`
		EnglishLanguagePreference string `json:"english_language_preference"`
		PersonalPreference        string `json:"personal_preference"`
	}

	var user req
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondWithError(w, http.StatusInternalServerError, "error decoding response", err)
		return
	}

	prompt := fmt.Sprintf(
		`You are a vocational counselor. Suggest the top 3 suitable vocational fields for the following person. Include short reasoning for the suggestion.
		Candidate Profile:
		* Educational Qualification: %s, 
		* Previous Experience: %s, 
		* Gender: %s, 
		* Physical Disability: %s, 
		* Sole Earner: %s, 
		* English Language Proficiency: %s, 
		* Personal Preference: %s, 
		Respond in JSON format:
		[
			{
				"vertical": A vertical of vocational skill 
				"confidence": A confidence in the prediction, which is an integer
				"justification": A single line justification for the role
				"duration": Give a duration of the course from one of the following options
			}
		]
    `, user.Education, user.PreviousExperience, user.Gender, user.PhysicalDisability, user.SoleEarner, user.EnglishLanguagePreference, user.PersonalPreference)
	var output bytes.Buffer

	command := exec.Command("python", "main.py", prompt)
	command.Stdout = &output
	err := command.Run()
	if err != nil {
		// return fmt.Errorf("error executing summarisation: %v", err)
		respondWithError(w, http.StatusInternalServerError, "error engaging LLM", err)
		return
	}

	// fmt.Println("Summary: ")
	// fmt.Println(output.String())
	outputString := output.String()
	outputString = strings.ReplaceAll(outputString, "```json", "")
	outputString = strings.ReplaceAll(outputString, "```", "")

	// return nil
	// respondWithJSON(w, http.StatusOK, output.String())
	type Recommendation struct {
		Vertical      string `json:"vertical"`
		Confidence    int    `json:"confidence"`
		Justification string `json:"justification"`
		Duration      string `json:"duration"`
	}
	var recommendations []Recommendation

	fmt.Println(outputString)
	// 1. Unmarshal the LLM's JSON string into Go structs
	err = json.Unmarshal([]byte(outputString), &recommendations)
	if err != nil {
		http.Error(w, "Error unmarshalling LLM output: "+err.Error(), http.StatusInternalServerError)
		log.Printf("Error unmarshalling LLM output: %v", err)
		return
	}

	// (Optional) You can now work with 'recommendations' as Go objects, e.g.,
	// for _, rec := range recommendations {
	// 	fmt.Printf("Vertical: %s, Confidence: %d\n", rec.Vertical, rec.Confidence)
	// }

	// 2. Marshal the Go structs back into JSON (ensures correct formatting)
	// Using json.MarshalIndent for pretty-printing, json.Marshal for compact output
	jsonResponse, err := json.Marshal(recommendations)
	// fmt.Println(string(jsonResponse))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "error marshalling", err)
		return
	}

	// respondWithJSON(w, http.StatusOK, jsonResponse)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)

}
