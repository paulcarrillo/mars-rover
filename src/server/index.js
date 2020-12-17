require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API calls

// Fetch Mars Rover Photos
app.get('/roverimages/:name', async (req, res) => {
    try {        
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`)                               
            .then(res => res.json())
            res.send(data);
    } catch (err) {
        console.log('error:', err);
    }
});

// Fetch Mars Rover Manifest
app.get('/roverdata/:name', async (req, res) => {
    try {        
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.params.name}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            res.send(data);
    } catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))