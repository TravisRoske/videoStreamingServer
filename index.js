"use strict"
const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config()
const PORT = process.env.PORT || 4040;

app.use(express.static(__dirname + "/public"))

app.get("/video", (req, res) => {
    const range = req.headers.range;
    if(!range) {
        res.status(400).send(`Request requires "Range" header`)
    }
    const vidPath = "sampleVideo.mp4";
    const vidSize = fs.statSync("sampleVideo.mp4").size;
    const chunkSize = 10 ** 6;
    const start = Number(range.match(/\d+/g))
    const end = Math.min(start + chunkSize, vidSize - 1);
    const sentChunkSize = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${vidSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": sentChunkSize,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers)
    const vStream = fs.createReadStream(vidPath, { start, end }); //they have to be named start and end, or use { start: var, end: endvar}...
    vStream.pipe(res);
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
