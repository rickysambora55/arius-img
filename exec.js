const arg = process.argv;
import { generateLeaderboard } from "./leaderboard.js";
import { getToken, fetchData } from "./functions/function.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (arg.length < 3) {
    console.log("Usage: node exec.js <ta/ga> <season>");
    process.exit(1);
}

const type = arg[2];

if (["ta", "ga"].indexOf(type) === -1) {
    console.log('Rank type must be either "ta" or "ga"');
    process.exit(1);
}

const season = parseInt(arg[3]);

if (isNaN(season) || season < 1) {
    console.log("Season must be a positive integer");
    process.exit(1);
}

console.log(`Rank type: ${type}`);
console.log(`Season: ${season}`);

// Fetch token from JWT
const token = await getToken();

// Fetch ranks from API
const ranks = await fetchData(
    `${process.env.API_WEB}/api/ranks/${type}/season/${season}`,
    token
);

// Generate leaderboard image
generateLeaderboard(ranks, type);

// Output
console.log("Leaderboard image generated successfully");
console.log("Check the 'output' directory for the generated image");
console.log(
    `Leaderboard image path: ${join(
        __dirname,
        "output",
        `${type}_${season}.png`
    )}`
);
