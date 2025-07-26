app.post("/submit-evaluation", async (req, res) => {
  const data = req.body;

  const baseData = {
    trainee_name: data.name,
    job_vertical: data.vertical,
    additional_comments: data.comments,
    overall_recommendation: data.recommendation,
  };

  const allScores = [
    "Technical Skills",
    "Customer Service",
    "Hygiene & Safety",
    "Communication",
    "Punctuality",
    "Safety Protocols",
    "Teamwork",
    "Physical Fitness",
    "Writing Quality",
    "Creativity",
    "Research Skills",
    "Meeting Deadlines",
    "Client Communication",
    "Quality Control",
    "Equipment Handling"
  ];

  allScores.forEach((field) => {
    const dbField = field.toLowerCase().replace(/ /g, "_").replace("&", "and");
    if (data.scores[field] !== undefined) {
      baseData[dbField] = data.scores[field];
    }
  });

  try {
    console.log("Inserting data into Supabase:", baseData);

    const { error } = await supabase.from("trainee_evaluations").insert([baseData]);

    if (error) {
      console.error("Supabase insert error:", error.message, error.details);
      return res.status(500).json({ message: "Supabase insert failed", error: error.message });
    }

    res.status(200).json({ message: "Evaluation submitted successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server crashed", error: err.message });
  }
});
