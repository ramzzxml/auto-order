/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.orderkuota.id',
      },
      {
        protocol: 'https',
        hostname: 'app.orderkuota.com',
      },
    ],
  },
};

export default nextConfig;
