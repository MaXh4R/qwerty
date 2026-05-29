const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnnonKey);

app.get('/todos', async (req, res) =>{
    const {data, error} = await supabase
    .from('todos')
    .select('*');

    if (error) return res.status(500).json ({error: error.message});
    res.status(200).json(data);
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express.js!');
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);    
})





