import express from "express";
import fs from "fs";

export const app = express();

app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("video")
})



app.get("/chunk/video",(req,res)=>{
  
    const range = req.headers.range;

    if(!range) return res.status(416).send("Requires Range Headers")

    const videoPath = "videoplayer.mp4";
    const videoSize = fs.statSync(videoPath).size

    const CHUNK_SIZE = 10 ** 6;

    const startRange = Number(range.replace(/\D/g,""))

    const endRange = Math.min(startRange + CHUNK_SIZE, videoSize - 1)

    const Contentlength = endRange - startRange +1;

    const headers = {
        "Content-Range": `bytes ${startRange} - ${endRange}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": Contentlength,
        "Content-Type": "video/mp4",
    }

    res.writeHead(206,headers)

    const VideoStream = fs.createReadStream(videoPath,{startRange,endRange})

    VideoStream.pipe(res);

})