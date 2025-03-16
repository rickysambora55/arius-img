import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";

const config = {
    canvas: {
        baseWidth: 2550,
        baseHeight: 2900,
        width: 1275,
        height: 1450,
    },
    default: { student: 10000 },
    color: {
        primary: "#6c8be3",
        white: "#ffffff",
        black: "#262626",
    },
    card: {
        width: 746,
        height: 1026,
        y: 575,
        y2: 681,
    },
    card2: {
        width: 1130,
        height: 198,
        x: 87,
        x2: 1334,
        xCenter: 705,
        y: 1775,
        yNew: 626,
        diffY: 264,
    },
    profile: {
        topSize: 112,
        size: 100,
        topWeight: 700,
        weight: 900,
        color: "white",
        topAlign: "center",
        align: "left",
        topY: 1208,
        x: 167,
        x2: 1414,
        xCenter: 782,
        y: 1882,
        yNew: 733,
        diffY: 264,
    },
    rank: {
        topSize: 68,
        size: 44,
        topHashtag: 34,
        hashtag: 30,
        hashtagTopGap: 12,
        hashtagGap: 3,
        color: "black",
        align: "right",
        crownY: 605,
        iconTopY: 1048,
        iconX: 138,
        iconX2: 1385,
        iconXCenter: 755,
        iconY: 1942,
        topY: 1377,
        x: 276,
        x2: 1523,
        xCenter: 893,
        y: 1956,
        yNew: 808,
        diffY: 264,
    },
    score: {
        topSize: 82,
        size: 44,
        color: "white",
        align: "left",
        topY: 1529,
        x: 332,
        x2: 1579,
        xCenter: 949,
        y: 1956,
        yNew: 808,
        diffY: 264,
    },
    raid: {
        width: 852,
        height: 255,
        size: 30,
        weight: 900,
        color: "black",
        nameSize: 92,
        nameColor: "white",
        align: "left",
        x: 91,
        y: 113,
        textX: 151,
        textY: 356,
        nameX: 128,
        nameY: 260,
        iconX: 118,
        iconY: 345,
    },
    date: { size: 30, color: "black", x: 291, y: 356 },
    limit: {
        page1: 10,
        pageMiddle: 16,
        pageLast: 10,
    },
};
const apiImage = "https://atsuko.mysrv.us";

//Dummy
const ranks = {
    count: 51,
    schedule: {
        season: 66,
        terrain: "Indoor",
        date: "04-Mar-2025",
        raid: "Shirokuro",
        dev_name: "Shirokuro",
        color: "#3772A9",
    },
    rows: [
        {
            ign: "Zeinu",
            id_member: 27,
            id_fav_student: 20007,
            rank: 1,
            score: 39754002,
            ranking: 1,
        },
        {
            ign: "liuzi",
            id_member: 120,
            id_fav_student: 10004,
            rank: 3,
            score: 39752641,
            ranking: 2,
        },
        {
            ign: "Mordred",
            id_member: 119,
            id_fav_student: 20039,
            rank: 6,
            score: 39731922,
            ranking: 3,
        },
        {
            ign: "Mizary",
            id_member: 25,
            id_fav_student: 10049,
            rank: 10,
            score: 39715921,
            ranking: 4,
        },
        {
            ign: "Kus",
            id_member: 30,
            id_fav_student: 23004,
            rank: 11,
            score: 39710243,
            ranking: 5,
        },
        {
            ign: "Nemura",
            id_member: 23,
            id_fav_student: 13006,
            rank: 13,
            score: 39706002,
            ranking: 6,
        },
        {
            ign: "Tarako",
            id_member: 99,
            id_fav_student: 10038,
            rank: 14,
            score: 39705121,
            ranking: 7,
        },
        {
            ign: "Kuro",
            id_member: 39,
            id_fav_student: 20039,
            rank: 16,
            score: 39702320,
            ranking: 8,
        },
        {
            ign: "ZedoX",
            id_member: 36,
            id_fav_student: 10004,
            rank: 21,
            score: 39695680,
            ranking: 9,
        },
        {
            ign: "Exus",
            id_member: 1,
            id_fav_student: 10014,
            rank: 22,
            score: 39694002,
            ranking: 10,
        },
        {
            ign: "Ryft",
            id_member: 6,
            id_fav_student: 20027,
            rank: 24,
            score: 39692322,
            ranking: 11,
        },
        {
            ign: "Layt",
            id_member: 14,
            id_fav_student: 10091,
            rank: 25,
            score: 39691441,
            ranking: 12,
        },
        {
            ign: "Faza",
            id_member: 21,
            id_fav_student: 10002,
            rank: 28,
            score: 39689363,
            ranking: 13,
        },
        {
            ign: "uryaa_",
            id_member: 38,
            id_fav_student: 10083,
            rank: 33,
            score: 39685681,
            ranking: 14,
        },
        {
            ign: "Yorita",
            id_member: 19,
            id_fav_student: 10004,
            rank: 37,
            score: 39680401,
            ranking: 15,
        },
        {
            ign: "ヒガシダ",
            id_member: 75,
            id_fav_student: null,
            rank: 43,
            score: 39674161,
            ranking: 16,
        },
        {
            ign: "Fsanctxサキ",
            id_member: 46,
            id_fav_student: 20014,
            rank: 44,
            score: 39672800,
            ranking: 17,
        },
        {
            ign: "Trake",
            id_member: 17,
            id_fav_student: 10098,
            rank: 58,
            score: 39655602,
            ranking: 18,
        },
        {
            ign: "Kazama",
            id_member: 77,
            id_fav_student: 16013,
            rank: 61,
            score: 39653680,
            ranking: 19,
        },
        {
            ign: "Franz",
            id_member: 71,
            id_fav_student: 10035,
            rank: 62,
            score: 39652801,
            ranking: 20,
        },
        {
            ign: "Crenian",
            id_member: 29,
            id_fav_student: 13000,
            rank: 66,
            score: 39650800,
            ranking: 21,
        },
        {
            ign: "Doyle",
            id_member: 18,
            id_fav_student: 10021,
            rank: 72,
            score: 39644723,
            ranking: 22,
        },
        {
            ign: "Marista",
            id_member: 47,
            id_fav_student: null,
            rank: 73,
            score: 39644320,
            ranking: 23,
        },
        {
            ign: "Asep",
            id_member: 116,
            id_fav_student: 10108,
            rank: 76,
            score: 39641442,
            ranking: 24,
        },
        {
            ign: "DedekPlana",
            id_member: 37,
            id_fav_student: null,
            rank: 79,
            score: 39635840,
            ranking: 25,
        },
        {
            ign: "Mocaxie",
            id_member: 85,
            id_fav_student: null,
            rank: 80,
            score: 39633040,
            ranking: 26,
        },
        {
            ign: "Kidd",
            id_member: 32,
            id_fav_student: 10077,
            rank: 82,
            score: 39632000,
            ranking: 27,
        },
        {
            ign: "—͟͞͞ⲙ๏๏ꛘ",
            id_member: 103,
            id_fav_student: 16007,
            rank: 90,
            score: 39627520,
            ranking: 28,
        },
        {
            ign: "Gry",
            id_member: 44,
            id_fav_student: null,
            rank: 92,
            score: 39626641,
            ranking: 29,
        },
        {
            ign: "Hacho",
            id_member: 113,
            id_fav_student: 10062,
            rank: 103,
            score: 39617200,
            ranking: 30,
        },
        {
            ign: "YuuKaede",
            id_member: 35,
            id_fav_student: 10067,
            rank: 106,
            score: 39613280,
            ranking: 31,
        },
        {
            ign: "Eve",
            id_member: 34,
            id_fav_student: 23003,
            rank: 117,
            score: 39608161,
            ranking: 32,
        },
        {
            ign: "Meggumi",
            id_member: 4,
            id_fav_student: 10086,
            rank: 153,
            score: 39587440,
            ranking: 33,
        },
        {
            ign: "Serion",
            id_member: 76,
            id_fav_student: null,
            rank: 234,
            score: 39561920,
            ranking: 34,
        },
        {
            ign: "Ursalia",
            id_member: 117,
            id_fav_student: 10004,
            rank: 244,
            score: 39555599,
            ranking: 35,
        },
        {
            ign: "Komari",
            id_member: 28,
            id_fav_student: 10018,
            rank: 274,
            score: 39543601,
            ranking: 36,
        },
        {
            ign: "Lazu",
            id_member: 70,
            id_fav_student: 20016,
            rank: 431,
            score: 39475602,
            ranking: 37,
        },
        {
            ign: "Alice",
            id_member: 2,
            id_fav_student: 20040,
            rank: 774,
            score: 39267198,
            ranking: 38,
        },
        {
            ign: "Thio",
            id_member: 15,
            id_fav_student: 10080,
            rank: 799,
            score: 39256244,
            ranking: 39,
        },
        {
            ign: "Walang",
            id_member: 9,
            id_fav_student: 20013,
            rank: 853,
            score: 39219121,
            ranking: 40,
        },
        {
            ign: "Epinefrin",
            id_member: 20,
            id_fav_student: null,
            rank: 869,
            score: 39207680,
            ranking: 41,
        },
        {
            ign: "RinSo",
            id_member: 22,
            id_fav_student: null,
            rank: 874,
            score: 39202643,
            ranking: 42,
        },
        {
            ign: "Teio55",
            id_member: 48,
            id_fav_student: 20008,
            rank: 893,
            score: 39192481,
            ranking: 43,
        },
        {
            ign: "Lest",
            id_member: 8,
            id_fav_student: 10066,
            rank: 969,
            score: 39124403,
            ranking: 44,
        },
        {
            ign: "Teru",
            id_member: 73,
            id_fav_student: null,
            rank: 988,
            score: 39110320,
            ranking: 45,
        },
        {
            ign: "SneK",
            id_member: 3,
            id_fav_student: 10002,
            rank: 991,
            score: 39107920,
            ranking: 46,
        },
        {
            ign: "Dian911",
            id_member: 41,
            id_fav_student: 13001,
            rank: 1081,
            score: 39028561,
            ranking: 47,
        },
        {
            ign: "Dappa",
            id_member: 12,
            id_fav_student: 10049,
            rank: 1768,
            score: 27753984,
            ranking: 48,
        },
        {
            ign: "Fueeru",
            id_member: 5,
            id_fav_student: 10029,
            rank: 2428,
            score: 27741376,
            ranking: 49,
        },
        {
            ign: "R4deus",
            id_member: 10,
            id_fav_student: null,
            rank: 2638,
            score: 27738496,
            ranking: 50,
        },
        {
            ign: "Kusa",
            id_member: 33,
            id_fav_student: 10100,
            rank: 4645,
            score: 27715840,
            ranking: 51,
        },
    ],
};
const type = "ta";

const imageCache = {};
GlobalFonts.registerFromPath(`fonts/AllenSans-Bold.ttf`, "profile");
GlobalFonts.registerFromPath(`fonts/Canterbury.ttf`, "logo");
GlobalFonts.registerFromPath(`fonts/FontSpring-BoldItalic.otf`, "raid");
GlobalFonts.registerFromPath(`fonts/ZingRustDemo-Base.otf`, "number");

// Store images
async function getCachedImage(path, loader = loadImage) {
    const resolvedPath = typeof path === "function" ? path() : path;

    if (!imageCache[path]) {
        if (!(await fileExists(resolvedPath))) {
            throw new Error(`Image not found: ${resolvedPath}`);
        }

        try {
            if (resolvedPath.startsWith("http")) {
                imageCache[resolvedPath] = getImage(resolvedPath);
            } else {
                imageCache[resolvedPath] = loader(resolvedPath);
            }
        } catch (error) {
            throw new Error(`Unsupported image source: ${resolvedPath}`);
        }
    }
    return await imageCache[path];
}

// Load images in batch
async function loadImages(paths) {
    const entries = await Promise.all(
        Object.entries(paths).map(async ([key, path]) => [
            key,
            await getCachedImage(path),
        ])
    );
    return Object.fromEntries(entries);
}

// Check image exist
async function fileExists(path) {
    try {
        if (path.startsWith("http")) {
            const res = await fetch(path, { method: "HEAD" });
            return res.ok;
        } else {
            await fs.access(path);
            return true;
        }
    } catch {
        return false;
    }
}

// Fetch data from api
async function fetchData(url) {
    try {
        const response = await fetch(url);

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

// Fetch image from api
async function getImage(url) {
    const response = await fetch(url);
    if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const image = await loadImage(Buffer.from(buffer));
    return image;
}

// Get rank icon
function getRankIcon(rank, rankIcon) {
    let icon;
    // Icon raid
    if (
        !rank ||
        rank === "undefined" ||
        String(rank).replace(/\s/g, "") == ""
    ) {
        icon = rankIcon.bronze;
        return icon;
    }

    if (rank <= 10000) {
        icon = rankIcon.platinum;
    } else if (rank <= 50000) {
        icon = rankIcon.gold;
    } else if (rank <= 100000) {
        icon = rankIcon.silver;
    } else {
        icon = rankIcon.bronze;
    }
    return icon;
}

// Crop lobby image into square image
async function processLobbyAvatar(image) {
    // Create a canvas for the full-size image
    const canvas = createCanvas(182, 144);
    const ctx = canvas.getContext("2d");

    // Resize the image (draw scaled)
    ctx.drawImage(image, 0, 0, 182, 144);

    // Create another canvas for the extracted portion
    const croppedCanvas = createCanvas(124, 124);
    const croppedCtx = croppedCanvas.getContext("2d");

    // Extract (crop) the portion from the original resized image
    croppedCtx.drawImage(canvas, 30, 10, 124, 124, 0, 0, 124, 124);

    return croppedCanvas;
}

// Draw lobby image into card
function drawFavImage(ctx, image, width, height, type = "small") {
    const originalWidth = type == "small" ? width : width * 0.9;
    width = type == "small" ? width : width * 1.2;
    const canvasRatio = width / height;

    let sx, sy, sWidth, sHeight;
    let dx = type == "bigOverlay" ? 0 : originalWidth,
        dy = type == "top" ? 200 : type == "big" ? 100 : 0,
        dWidth = width,
        dHeight = height;

    if (type == "bigOverlay") {
        // Image is wider than target, crop width (focus on center)
        sHeight = image.height;
        sWidth = sHeight * canvasRatio;
        sx = (image.width - sWidth) / 2;
        sy = 0;
    } else {
        // Image is taller than target, crop height (focus on center)
        sWidth = image.width;
        sHeight = sWidth / canvasRatio;
        sx = 0;
        sy = type == "small" ? (image.height - sHeight) / 2 : 0;
    }

    // Draw cropped image
    ctx.filter = type == "bigOverlay" ? "blur(1px)" : "none";
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.filter = "none";

    if (type === "bigOverlay") {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(dx, dy, dWidth, dHeight);
        ctx.restore();
    }
}

// Fill raid image to background
function fillRaidImage(ctx, plane, img, bg = true) {
    // Calculate the aspect ratio of the image
    const imgRatio = img.width / img.height;
    const canvasRatio = plane.width / plane.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
        // Image is wider than canvas, fit height
        drawHeight = plane.height;
        drawWidth = img.width * (plane.height / img.height);
        offsetX = bg
            ? (plane.width - drawWidth) / 2
            : (plane.width - drawWidth) / 5;
        offsetY = 0;
    } else {
        // Image is taller than canvas, fit width
        drawWidth = plane.width;
        drawHeight = img.height * (plane.width / img.width);
        offsetX = bg ? 0 : plane.width / 5;
        offsetY = 0; // (plane.height - drawHeight) / 2;
    }

    ctx.filter = bg ? "blur(3px)" : "none";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.filter = "none";
}

// Draw raid
async function drawRaid(layout, plane, background, portrait = null) {
    const canvas = createCanvas(config.raid.width, config.raid.height);

    const ctx = canvas.getContext("2d");

    // Draw image
    ctx.drawImage(plane, 0, 0);

    // Apply masking (favImage covers the plane)
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    fillRaidImage(ctx, plane, background, portrait ? true : false);
    ctx.restore();

    // Apply layout
    ctx.drawImage(layout, 0, 0);

    const additionalImage =
        portrait && (await drawRaid(layout, canvas, portrait));
    return portrait ? additionalImage : canvas;
}

// Draw card rank
async function drawCard(layout, plane, fav, type = "small", img = null) {
    const canvas =
        type == "small"
            ? createCanvas(config.card2.width, config.card2.height)
            : createCanvas(config.card.width, config.card.height);

    const ctx = canvas.getContext("2d");

    const favImage = await processLobbyAvatar(
        await getImage(`${apiImage}/assets/lobby/${fav}.webp`)
    );

    // Draw image
    ctx.drawImage(plane, 0, 0);

    // Apply masking (favImage covers the plane)
    ctx.save();
    ctx.globalCompositeOperation = "source-in";
    if (type == "small") {
        drawFavImage(ctx, favImage, plane.width / 2, plane.height);
    } else if (type == "bigOverlay") {
        drawFavImage(ctx, favImage, plane.width, plane.height, type);
    } else {
        drawFavImage(
            ctx,
            favImage,
            plane.width / 2 - favImage.width,
            plane.height,
            type
        );
    }
    ctx.restore();

    // Apply layout
    ctx.drawImage(layout, 0, 0);

    const additionalImage =
        img && (await drawCard(canvas, img, fav, "bigOverlay"));
    return img ? additionalImage : canvas;
}

// Draw big card top 3
async function drawBigCard(
    ctx,
    rank,
    posX,
    cardLayout,
    cardPlane,
    cardBGPlane,
    rankIcon,
    crown,
    isTop = false
) {
    const bigCard = await drawCard(
        cardLayout,
        cardPlane,
        rank.id_fav_student || config.default.student,
        isTop ? "top" : "big",
        cardBGPlane
    );

    const yOffset = isTop ? config.card.y : config.card.y2;

    ctx.drawImage(bigCard, posX - cardLayout.width / 2, yOffset);

    ctx.drawImage(
        getRankIcon(rank.rank || null, rankIcon),
        posX - rankIcon.width / 3.6,
        config.rank.iconTopY - (isTop ? 0 : 3),
        rankIcon.width / 1.8,
        rankIcon.height / 1.8
    );

    if (isTop && rank.rank === 1) {
        ctx.drawImage(crown, posX - crown.width / 2, config.rank.crownY);
    }

    ctx.font = `${config.profile.topWeight} ${config.profile.size}px 'profile'`;
    ctx.fillStyle = `${config.color[config.profile.color]}`;
    ctx.textAlign = config.profile.topAlign;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(`${rank.ign || "Unknown"}`, posX, config.profile.topY);

    ctx.font = `${config.rank.topSize}px 'number'`;
    ctx.fillStyle = `${config.color[config.rank.color]}`;
    ctx.fillText(`${rank.rank || ""}`, posX, config.rank.topY);

    const rankLength = ctx.measureText(`${rank.rank || ""}`).width;
    ctx.font = `${config.rank.topHashtag}px 'number'`;
    ctx.fillText(
        `#`,
        posX - rankLength / 2 - config.rank.hashtagTopGap,
        config.rank.topY
    );

    ctx.font = `${config.score.topSize}px 'number'`;
    ctx.fillStyle = `${config.color[config.score.color]}`;
    ctx.fillText(
        rank.score ? rank.score.toLocaleString() : "-",
        posX,
        config.score.topY
    );
}

// Draw small card
async function drawSmallCard(
    ctx,
    pos,
    rank,
    rankIcon,
    card3Layout,
    card3Plane,
    x,
    iconX,
    profileX,
    rankX,
    scoreX,
    posY
) {
    const smallCard = await drawCard(
        card3Layout,
        card3Plane,
        rank.id_fav_student || config.default.student
    );

    ctx.drawImage(smallCard, x, posY.card + config.card2.diffY * pos);
    ctx.drawImage(
        getRankIcon(rank.rank || null, rankIcon),
        iconX - rankIcon.width / 6,
        posY.icon - rankIcon.height / 6 + config.rank.diffY * pos,
        rankIcon.width / 3,
        rankIcon.height / 3
    );

    ctx.font = `${config.profile.weight} ${config.profile.size}px 'profile'`;
    ctx.fillStyle = `${config.color[config.profile.color]}`;
    ctx.textAlign = config.profile.align;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
        `${rank.ign || "Unknown"}`,
        profileX,
        posY.profile + config.profile.diffY * pos
    );

    ctx.font = `${config.rank.size}px 'number'`;
    ctx.textAlign = config.rank.align;
    ctx.fillStyle = `${config.color[config.rank.color]}`;
    ctx.fillText(
        `${rank.rank || ""}`,
        rankX,
        posY.rank + config.rank.diffY * pos
    );

    const rankLength = ctx.measureText(`${rank.rank || ""}`).width;
    ctx.font = `${config.rank.hashtag}px 'number'`;
    ctx.fillText(
        `#`,
        rankX - rankLength - config.rank.hashtagGap,
        posY.rank + config.rank.diffY * pos
    );

    ctx.font = `${config.score.size}px 'number'`;
    ctx.textAlign = config.score.align;
    ctx.fillText(
        rank.score ? rank.score.toLocaleString() : "-",
        scoreX,
        posY.score + config.rank.diffY * pos
    );
}

try {
    // Create canvas and scaling factors
    const canvas = createCanvas(
        config.canvas.baseWidth,
        config.canvas.baseHeight
    );

    const ctx = canvas.getContext("2d");

    const raidName = ranks?.schedule?.raid || "Unknown";
    const raidDevName = ranks?.schedule?.dev_name || "Unknown";
    const rankData = ranks?.rows || [];
    const raidType = type == "ta" ? "T.Assault" : "G.Assault";
    const raidTerrain = ranks?.schedule?.terrain || "Unknown";
    const raidDate = ranks?.schedule?.date || "Unknown";
    const date = raidDate !== "Unknown" ? new Date(raidDate) : "Unknown";
    const raidFormattedDate =
        raidDate !== "Unknown"
            ? date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
              })
            : "Unknown";

    // Import layouts
    const paths = {
        layout: "./images/leaderboard/layout.png",
        layout2: "./images/leaderboard/layout2.png",
        gradient: "./images/leaderboard/gradient.png",
        raidPlane: "./images/leaderboard/raid plane.png",
        raidLayout: "./images/leaderboard/raid layout.png",
        cardLayout: "./images/leaderboard/card layout.png",
        cardPlane: "./images/leaderboard/card plane.png",
        cardBGPlane: "./images/leaderboard/card bgplane.png",
        card2Layout: "./images/leaderboard/card2 layout.png",
        card2Plane: "./images/leaderboard/card2 plane.png",
        card2BGPlane: "./images/leaderboard/card2 bgplane.png",
        card3Layout: "./images/leaderboard/card3 layout.png",
        card3Plane: "./images/leaderboard/card3 plane.png",
        crown: "./images/leaderboard/crown.png",
        sticker: "./images/leaderboard/sticker.png",
    };
    const dynamicPaths = {
        raidBackground: `./images/raid/background/${raidDevName}.png`,
        raidSprite: `./images/raid/portrait/${raidDevName}.png`,
        platinum: `${apiImage}/assets/rank/Platinum.webp`,
        gold: `${apiImage}/assets/rank/Gold.webp`,
        silver: `${apiImage}/assets/rank/Silver.webp`,
        bronze: `${apiImage}/assets/rank/Bronze.webp`,
        indoor: `${apiImage}/assets/terrain/Indoor.webp`,
        outdoor: `${apiImage}/assets/terrain/Outdoor.webp`,
        urban: `${apiImage}/assets/terrain/Urban.webp`,
    };

    const allPaths = { ...paths, ...dynamicPaths };
    const loadedImages = await loadImages(allPaths);
    const {
        layout,
        layout2,
        gradient,
        raidPlane,
        raidLayout,
        cardLayout,
        cardPlane,
        cardBGPlane,
        card2Layout,
        card2Plane,
        card2BGPlane,
        card3Layout,
        card3Plane,
        crown,
        sticker,
        raidBackground,
        raidSprite,
        platinum,
        gold,
        silver,
        bronze,
        indoor,
        outdoor,
        urban,
    } = loadedImages;

    const rankIcon = { platinum, gold, silver, bronze };
    const terrainIcon = { indoor, outdoor, urban };

    // Background
    // ctx.fillStyle = "green";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(raidBackground, 0, 0);
    ctx.drawImage(gradient, 0, 0);

    // Raid box
    const box = await drawRaid(
        raidLayout,
        raidPlane,
        raidBackground,
        raidSprite
    );

    // Loop card
    let page = 0;
    let pos = 0;
    let localCanvasCreated = false;
    let canvasPage, ctxPage;
    for (let i = 0; i < rankData.length; i++) {
        // Local canvas
        if (!localCanvasCreated) {
            canvasPage = createCanvas(
                config.canvas.width,
                config.canvas.height
            );
            ctxPage = canvasPage.getContext("2d");
            ctxPage.scale(
                config.canvas.width / config.canvas.baseWidth,
                config.canvas.height / config.canvas.baseHeight
            );
            ctxPage.drawImage(canvas, 0, 0);

            // Set layout
            if (page === 0) {
                ctxPage.drawImage(layout, 0, 0);
            } else {
                ctxPage.drawImage(layout2, 0, 0);
            }

            // Raid box
            ctxPage.drawImage(box, config.raid.x, config.raid.y);
            ctxPage.drawImage(
                terrainIcon[raidTerrain.toLowerCase()],
                config.raid.iconX - indoor.width / 5.2,
                config.raid.iconY - indoor.height / 5.2,
                indoor.width / 2.6,
                indoor.height / 2.6
            );
            ctxPage.font = `${config.raid.weight} ${config.raid.size}px 'number'`;
            ctxPage.fillStyle = `${config.color[config.raid.color]}`;
            ctxPage.textAlign = config.raid.align;
            ctxPage.textBaseline = "alphabetic";
            ctxPage.fillText(
                String(raidType),
                config.raid.textX,
                config.raid.textY
            );
            ctxPage.fillText(
                String(raidFormattedDate),
                config.date.x,
                config.date.y
            );
            ctxPage.font = `${config.raid.weight} ${config.raid.nameSize}px 'raid'`;
            ctxPage.fillStyle = `${config.color[config.raid.nameColor]}`;
            ctxPage.fillText(
                String(raidName),
                config.raid.nameX,
                config.raid.nameY
            );

            localCanvasCreated = true;
        }

        const rank = rankData[i];
        if (i < 3) {
            // Big card
            if (rank) {
                if (i === 0) {
                    await drawBigCard(
                        ctxPage,
                        rank,
                        canvas.width / 2,
                        cardLayout,
                        cardPlane,
                        cardBGPlane,
                        rankIcon,
                        crown,
                        true
                    );
                } else {
                    const posX =
                        i === 1
                            ? (canvas.width / 16) * 3
                            : (canvas.width / 16) * 13;
                    await drawBigCard(
                        ctxPage,
                        rank,
                        posX,
                        card2Layout,
                        card2Plane,
                        card2BGPlane,
                        rankIcon,
                        crown
                    );
                }
            }
        } else {
            // Small card positioning
            const posY = {
                card: page === 0 ? config.card2.y : config.card2.yNew,
                icon: page === 0 ? config.rank.iconY : config.rank.iconYNew,
                profile: page === 0 ? config.profile.y : config.profile.yNew,
                rank: page === 0 ? config.rank.y : config.rank.yNew,
                score: page === 0 ? config.score.y : config.score.yNew,
            };

            // Determine position and call the function
            if (
                i === config.limit.page1 - 1 ||
                (i === rankData.length - 1 && rankData.length % 2 !== 0)
            ) {
                await drawSmallCard(
                    ctxPage,
                    pos,
                    rank,
                    rankIcon,
                    card3Layout,
                    card3Plane,
                    config.card2.xCenter,
                    config.rank.iconXCenter,
                    config.profile.xCenter,
                    config.rank.xCenter,
                    config.score.xCenter,
                    posY
                );
                pos++;
            } else if (
                (page === 0 && i % 2 === 0) ||
                (page > 0 && i % 2 != 0)
            ) {
                await drawSmallCard(
                    ctxPage,
                    pos,
                    rank,
                    rankIcon,
                    card3Layout,
                    card3Plane,
                    config.card2.x2,
                    config.rank.iconX2,
                    config.profile.x2,
                    config.rank.x2,
                    config.score.x2,
                    posY
                );
                pos++;
            } else {
                await drawSmallCard(
                    ctxPage,
                    pos,
                    rank,
                    rankIcon,
                    card3Layout,
                    card3Plane,
                    config.card2.x,
                    config.rank.iconX,
                    config.profile.x,
                    config.rank.x,
                    config.score.x,
                    posY
                );
            }
        }

        // Sticker on the last page
        if (
            i === rankData.length - 1 &&
            pos <= Math.ceil(config.limit.pageLast / 2)
        ) {
            ctxPage.drawImage(
                sticker,
                canvas.width / 2 - sticker.width / 5,
                1900,
                sticker.width / 2.5,
                sticker.height / 2.5
            );
        }

        // Next page
        if (
            (page === 0 && i >= config.limit.page1 - 1) ||
            (page > 0 &&
                (i - (config.limit.page1 - 1)) % config.limit.pageMiddle ===
                    0) ||
            i === rankData.length - 1
        ) {
            // Save
            const buffer = canvasPage.toBuffer("image/webp", { quality: 1 });

            const outputFileName = `output${page}.webp`;
            const outputPath = path.join("output", outputFileName);

            // Save the buffer to a file in the specified folder
            fs.writeFile(outputPath, buffer);

            page += 1;
            pos = 0;
            localCanvasCreated = false;
        }
    }
} catch (error) {
    console.log(error);
}
