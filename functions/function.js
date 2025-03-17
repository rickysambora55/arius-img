import jwt from "jsonwebtoken";

export async function getToken() {
    const payload = {
        service: process.env.NAME,
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
        console.error("Error fetching data:", error);
        return {};
    }
}
