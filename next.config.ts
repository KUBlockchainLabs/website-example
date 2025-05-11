import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable compression for smaller bundle sizes
    compress: true,

    // Custom build directory
    distDir: "dist",

    // Generate a consistent build ID from Git hash or timestamp
    generateBuildId: async () => {
        return process.env.GIT_HASH || `build-${Date.now()}`;
    },

    // Enable React StrictMode for better development experience
    reactStrictMode: true,

    // Improve production performance with optimizations
    swcMinify: true,

    // Configure caching and optimization
    // onDemandEntries: {
    //     maxInactiveAge: 60 * 60 * 1000, // 1 hour
    //     pagesBufferLength: 5,
    // },

    // Security headers
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'",
                    },
                ],
            },
        ];
    },

    // Optimize images
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            // Add your allowed image sources here
            // Example: { protocol: 'https', hostname: 'example.com' }
        ],
    },

    // Enable SWC compilation for faster builds
    experimental: {
        optimizeCss: true,
        scrollRestoration: true,
    },

    // Handle environment variables
    env: {
        APP_ENV: process.env.NODE_ENV || "development",
    },
};

export default nextConfig;
