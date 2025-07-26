const router = require('express').Router();
require('dotenv').config();
const supabase = require('../supabaseClient');

router.post('/add/company', async (req, res) => {
    const companyData = req.body;
    
    // Convert openings field to number if it exists and is a string
    if (companyData.openings && typeof companyData.openings === 'string') {
        companyData.openings = Number(companyData.openings);
    }
    console.log("Adding company:", companyData);
    const {name, domain, openings, pin_code, description} = companyData;
    const { data, error } = await supabase
        .from('companies')
        .insert([{
            name,
            domain,
            openings,
            pin_code,
            description
        }])
        .select()
        .single();

    if (error) {
        console.error('Error inserting company:', error);
        return res.status(500).json({ message: 'Failed to add company', error: error.message });
    }
    console.log(companyData)
    res.status(201).json({ message: 'Company added successfully', company: companyData });
});

router.get('/companies', async (req, res) => {
    const { data, error } = await supabase  
        .from('companies')
        .select('*');   

    if (error) {
        console.error('Error fetching companies:', error);
        return res.status(500).json({ message: 'Failed to fetch companies', error: error.message });
    }

    res.status(200).json({ companies: data });
});

module.exports = router;
