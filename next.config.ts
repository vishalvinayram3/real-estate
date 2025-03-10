/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true, // ✅ Permanent redirect (301)
      },
    ];
  },
  images: {
    domains: ['njkdtjgciebwytrbblbt.supabase.co'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

module.exports = nextConfig;
