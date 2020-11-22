const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

const router = express.Router();

router.get('/pics', async (req, res) => {
    try {
        const pics = await axios.get('https://us-central1-codechella-b0537.cloudfunctions.net/api/tweets')
        // console.log(pics.data);
        res.send(pics.data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.use(router)
app.use(express.urlencoded({ extended: true }))

app.listen(8080)
