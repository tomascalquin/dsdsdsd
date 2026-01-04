import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // <--- ESTO PERMITE TODO (Modo seguro para desarrollo)
    ],
  },
};

export default nextConfig;