import "dotenv/config";
import { loadImage } from "@napi-rs/canvas";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import fs from "fs/promises";

const imageCache = new Map();
export async function getCachedImage(path, loader = loadImage) {
    const resolvedPath = typeof path === "function" ? path() : path;

    if (!imageCache.get(resolvedPath)) {
        if (!(await fileExists(resolvedPath))) {
            throw new Error(`Image not found: ${resolvedPath}`);
        }

        try {
            if (resolvedPath.startsWith("http")) {
                imageCache.set(resolvedPath, getImage(resolvedPath));
            } else {
                imageCache.set(resolvedPath, loader(resolvedPath));
            }
        } catch (error) {
            throw new Error(`Unsupported image source: ${resolvedPath}`);
        }
    }
    return await imageCache.get(resolvedPath);
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

export async function getToken() {
    const payload = {
        service: process.env.JWT_NAME,
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
}

// Fetch data from api
export async function fetchData(url, token) {
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
        console.log("\n");
        console.error("Error fetching data:", error);
        return;
    }
}
