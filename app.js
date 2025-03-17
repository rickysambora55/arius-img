import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { checkSchema, matchedData } from "express-validator";
import { seasonFilter } from "./validations/validate.js";
import { generateLeaderboard } from "./leaderboard.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
    cors({
        methods: ["GET"],
    })
);

const payload = {
    service: process.env.NAME,
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
};

const token = jwt.sign(payload, process.env.JWT_SECRET);

// Fetch data from api
async function fetchData(url, token) {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return {};
    }
}

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
