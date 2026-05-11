// next.config.mjs (Sahi)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... aapka configuration
  images: {
    // Ye images configuration aapne pichle step mein add kiya tha
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', 
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', 
      },
    ],
  },
};

export default nextConfig; // ✅ FIX: Use 'export default' instead of 'module.exports'