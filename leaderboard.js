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
        await getImage(`${process.env.API_BOT}/assets/lobby/${fav}.webp`)
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
        posX - rankIcon.platinum.width / 3.6,
        config.rank.iconTopY - (isTop ? 0 : 3),
        rankIcon.platinum.width / 1.8,
        rankIcon.platinum.height / 1.8
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
        iconX - rankIcon.platinum.width / 6,
        posY.icon - rankIcon.platinum.height / 6 + config.rank.diffY * pos,
        rankIcon.platinum.width / 3,
        rankIcon.platinum.height / 3
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

export async function generateLeaderboard(ranks, type) {
    const images = [];

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
            layout: "images/leaderboard/Layout.png",
            layout2: "images/leaderboard/Layout2.png",
            gradient: "images/leaderboard/Gradient.png",
            raidPlane: "images/leaderboard/Raid Plane.png",
            raidLayout: "images/leaderboard/Raid Layout.png",
            cardLayout: "images/leaderboard/Card Layout.png",
            cardPlane: "images/leaderboard/Card Plane.png",
            cardBGPlane: "images/leaderboard/Card BGPlane.png",
            card2Layout: "images/leaderboard/card2 Layout.png",
            card2Plane: "images/leaderboard/card2 Plane.png",
            card2BGPlane: "images/leaderboard/card2 BGPlane.png",
            card3Layout: "images/leaderboard/card3 Layout.png",
            card3Plane: "images/leaderboard/card3 Plane.png",
            crown: "images/leaderboard/Crown.png",
            sticker: "images/leaderboard/Sticker.png",
        };
        const dynamicPaths = {
            raidBackground: `images/raid/background/${raidDevName}.png`,
            raidSprite: `images/raid/portrait/${raidDevName}.png`,
            platinum: `${process.env.API_BOT}/assets/rank/Platinum.webp`,
            gold: `${process.env.API_BOT}/assets/rank/Gold.webp`,
            silver: `${process.env.API_BOT}/assets/rank/Silver.webp`,
            bronze: `${process.env.API_BOT}/assets/rank/Bronze.webp`,
            indoor: `${process.env.API_BOT}/assets/terrain/Indoor.webp`,
            outdoor: `${process.env.API_BOT}/assets/terrain/Outdoor.webp`,
            urban: `${process.env.API_BOT}/assets/terrain/Urban.webp`,
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
                    profile:
                        page === 0 ? config.profile.y : config.profile.yNew,
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
                const buffer = canvasPage.toBuffer("image/webp", {
                    quality: 1,
                });

                const outputFileName = `output${page}.webp`;
                const outputPath = path.join("output", outputFileName);

                // Save the buffer to a file in the specified folder
                fs.writeFile(outputPath, buffer);

                // Convert to Base64
                const dataURL = canvasPage.toDataURL();
                images.push(dataURL);

                page += 1;
                pos = 0;
                localCanvasCreated = false;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return images;
}
