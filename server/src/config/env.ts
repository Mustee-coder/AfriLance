import "dotenv/config";

const requiredEnv = [
"MONGODB_URI",
"JWT_SECRET",
"CLIENT_URL",
] as const;

for (const key of requiredEnv) {
if (!process.env[key]) {
throw new Error("Missing required environment variable: ${key}");
}
}

export const env = {
port: Number(process.env.PORT) || 5000,
nodeEnv: process.env.NODE_ENV || "development",
mongodbUri: process.env.MONGODB_URI as string,
jwtSecret: process.env.JWT_SECRET as string,
jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
clientUrl: process.env.CLIENT_URL as string,
};