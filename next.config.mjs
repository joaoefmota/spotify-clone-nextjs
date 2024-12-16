/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

withBundleAnalyzer({ enabled: true });

const nextConfig = {
  images: {
    domains: ["fufvonkkxdiikwdatnox.supabase.co"],
  },
};

export default process.env.ANALYZE === "true"
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
