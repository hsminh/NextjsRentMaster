import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        domains: ['res.cloudinary.com'],
    },
  reactCompiler: true,
};

export default nextConfig;
