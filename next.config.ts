/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config: { watchOptions: { poll: number; aggregateTimeout: number; }; }) => {
    config.watchOptions = {
      poll: 60,
      aggregateTimeout: 60,
    };
    return config;
  },
};

export default nextConfig;