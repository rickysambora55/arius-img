const arg = process.argv;
import { generateLeaderboard } from "./leaderboard.js";
import { getToken, fetchData } from "./functions/function.js";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function showProgress(task, taskName = "Processing") {
    const total = 20;
    const maxProgress = Math.floor(total * 0.9);
    let progress = 0;

    console.log(`${taskName}...`);
    const startTime = Date.now();

    function updateProgress() {
        if (progress < maxProgress) {
            progress += 1;
            process.stdout.write(
                `\r[${"=".repeat(progress)}${" ".repeat(
                    Math.max(0, total - progress)
                )}] ${Math.round((progress / total) * 100)}%`
            );

            // Schedule the next update with a random delay
            setTimeout(
                updateProgress,
                Math.floor(Math.random() * (2000 - 200 + 1)) + 200
            );
        }
    }

    return new Promise(async (resolve, reject) => {
        updateProgress();

        try {
            const result = await task();
            const elapsedTime = Date.now() - startTime;
            progress = total;
            process.stdout.write("\r[====================] 100%\n");
            console.log(`✔ ${taskName} completed in ${elapsedTime} ms!`);
            resolve(result);
        } catch (error) {
            console.error(`\n❌ ${taskName} failed:`, error.message);
            reject(error);
        }
    });
}

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

async function main() {
    // Fetch ranks from API
    const ranks = await showProgress(
        () =>
            fetchData(
                `${process.env.API_WEB}/api/ranks/${type}/season/${season}`,
                token
            ),
        "Fetching data"
    );

    if (!ranks) {
        console.error("❌ No data received. Exiting...");
        return;
    }

    // Generating leaderboard image
    await showProgress(
        () => generateLeaderboard(ranks, type),
        "Generating leaderboard"
    );

    console.log("Leaderboard image generated successfully");
    console.log("Check the 'output' directory for the generated image");
    console.log(
        `Leaderboard image path: ${pathToFileURL(join(__dirname, "output"))}`
    );
}

main();
