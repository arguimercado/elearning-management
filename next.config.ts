import type { NextConfig } from "next";

// NOTE: Temporarily removed withNextVideo wrapper to debug build failure (EPERM scandir on user profile + FlightClientEntryPlugin error).
// Once resolved, re-introduce: import { withNextVideo } from "next-video/process"; export default withNextVideo(nextConfig)
// Also corrected images.remotePatterns to the object form expected by Next.js instead of passing a URL instance.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kel-ems-video-subscribe.t3.storage.dev",
        pathname: "/**"
      }
    ]
  },
 
  // experimental: {
  //   serverExternalPackages: [],
  // },
};

export default nextConfig;