import express from "express"
import { createReadStream, statSync } from "fs"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __fileName = fileURLToPath(import.meta.url)
const __dirName = dirname(__fileName)

const app = express()

app.get("/video", (req, res) => {
    const filePath = `${__dirName}/public/video.mp4`
    const stat = statSync(filePath)
    const fileSize = stat.size

    const range = req.headers.range
    if (!range) {
        res.status(400).send("requires range header")
    }

    const chunkSize = 10 ** 6
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunkSize, fileSize)
    const contentLength = end - start + 1

    const fileStream = createReadStream(filePath, {
        start,
        end
    })

    fileStream.pipe(res)

    const header = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
})

app.listen(3000, () => {
    console.log("server is running on port 3000");
})