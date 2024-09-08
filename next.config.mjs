/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    serverComponentsExternalPackages: ["@aws-sdk"],
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
  async headers() {
    return [
      {
        source: "/reset-password",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
