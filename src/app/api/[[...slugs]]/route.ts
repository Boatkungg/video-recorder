import swagger from "@elysiajs/swagger";
import {Elysia, t} from "elysia";
import ffmpeg from "fluent-ffmpeg";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
// import ffmpeginstaller from "@ffmpeg-installer/ffmpeg";

// ffmpeg.setFfmpegPath(ffmpeginstaller.path);

const app = new Elysia({prefix: "/api"})
    .use(swagger({path: "/swagger"}))
    .post("/save-video", async ({body, error}) => {
        const {video, trim_start, trim_end, video_name} = body;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const tempFilePath = path.join(uploadDir, "temp_" + `${video_name}.webm`);
        const outputFilePath = path.join(uploadDir, `${video_name}.webm`);

        try {
            await mkdir(uploadDir, {recursive: true});
            const buffer = Buffer.from(await video.arrayBuffer());
            await writeFile(tempFilePath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(tempFilePath)
                    .setStartTime(Number(trim_start))
                    .setDuration(Number(trim_end) - Number(trim_start))
                    .output(outputFilePath)
                    .on("end", resolve)
                    .on("error", reject)
                    .run();
            });

            await unlink(tempFilePath);

            return {message: "Video saved successfully", filename: `${video_name}.webm`};
        } catch (err) {
            return error(500, {message: "Failed to save video", error: err});
        }
    },
    {
        body: t.Object({
            video: t.File(),
            trim_start: t.String(),
            trim_end: t.String(),
            video_name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle