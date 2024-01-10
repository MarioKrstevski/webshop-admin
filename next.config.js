/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  // rewrites: async () => [
  //   {
  //     source: "/api/:path*",
  //     destination: "http://localhost:3000/api/:path*",
  //   },
  // ],
};

module.exports = nextConfig;
