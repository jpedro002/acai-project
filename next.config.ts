import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        // Isso força o WebSocket a aceitar a conexão do túnel
        allowedHosts: 'all',
      };
    }
    return config;
  },
};

export default nextConfig;
