/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/fm/main",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
