/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
    unoptimized: true,
    remotePatterns: [
        {
            protocol: "https",
            hostname: "cfbh-logos.s3.us-east-2.amazonaws.com",
            pathname: "/**",
        },
    ],
    },
};

export default nextConfig;
