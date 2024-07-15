/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, options) => {
        config.cache = false;
        return config;
    },
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true, // 빌드시 Eslint skip
    },
};

module.exports = nextConfig;
