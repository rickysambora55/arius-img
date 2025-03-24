import "dotenv/config";
import express from "express";
import cors from "cors";
import { checkSchema, matchedData } from "express-validator";
import { seasonFilter } from "../validations/validate.js";
import { generateLeaderboard } from "../leaderboard.js";
import { getToken, fetchData, getCachedImage } from "../functions/function.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
    cors({
        methods: ["GET"],
    })
);

async function preloadImages() {
    const token = await getToken();

    console.log("\n🔄 Preloading images...");
    const startTime = Date.now();

    const response = await fetchData(
        `${process.env.API_WEB}/api/admin/student`,
        token
    );

    let count = 0;
    if (response) {
        const students = response.rows.map((data) => data.id_student);
        for (const student of students) {
            await getCachedImage(
                `${process.env.API_BOT}/assets/lobby/${student}.webp`
            );
            count++;
        }
    } else {
        console.error("Failed to preload images");
    }

    const endTime = Date.now();
    console.log(
        `\n✅ ${count}/${response.count} images preloaded in ${
            endTime - startTime
        } ms.`
    );
}

app.get(
    "/leaderboard",
    checkSchema(seasonFilter, ["query"]),
    async (req, res) => {
        const token = await getToken();

        const { season = 1, type = "ta" } = matchedData(req, {
            locations: ["query"],
        });

        const response = await fetchData(
            `${process.env.API_WEB}/api/ranks/${type}/season/${season}`,
            token
        );

        if (!response) {
            return res.status(404).json({ message: "Rank data not found" });
        }

        const ranks = response;
        const images = await generateLeaderboard(ranks, type);

        return res.json({ ranks, images });
    }
);

app.listen(process.env.PORT || 3000, async () => {
    await preloadImages();
    console.log(`🚀 Server listening on ${process.env.PORT || 3000}`);
});

export default app;
