const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3100;


app.get('/songuri/:uri', (req,res)=>{
    console.log("Request received at song uri route.");

    let token;
    const getTokenUrl = 'http://localhost:3000';
    const uri = req.params.uri;
    
    // Get API token
    fetch(getTokenUrl)
    .then(res=>res.text())
    .then(token=>{console.log(`Token: ${token}\nURI: ${uri}`);})
    .catch(err=>console.log(`There was an error:\n${err}`));
})


app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));