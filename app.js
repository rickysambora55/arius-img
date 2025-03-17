import "dotenv/config";
import express from "express";
import cors from "cors";
import { checkSchema, matchedData } from "express-validator";
import { seasonFilter } from "./validations/validate.js";
import { generateLeaderboard } from "./leaderboard.js";
import { getToken, fetchData } from "./functions/function.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
    cors({
        methods: ["GET"],
    })
);

const token = await getToken();

app.get(
    "/leaderboard",
    checkSchema(seasonFilter, ["query"]),
    async (req, res) => {
        const { season = 1, type = "ta" } = matchedData(req, {
            locations: ["query"],
        });

        const response = await fetchData(
            `${process.env.API_WEB}/api/ranks/${type}/season/${season}`,
            token
        );

        const ranks = response;
        const images = await generateLeaderboard(ranks, type);

        res.json({ images });
    }
);

app.listen(process.env.PORT || 3000, () =>
    console.log(`Server listening on ${process.env.PORT || 3000}`)
);
