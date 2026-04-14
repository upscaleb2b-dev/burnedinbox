import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.burnedinbox.com" }],
        destination: "https://burnedinbox.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
