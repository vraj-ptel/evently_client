import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[new URL('http://res.cloudinary.com/**'),new URL('https://res.cloudinary.com/**')]
  }
};

export default nextConfig;
