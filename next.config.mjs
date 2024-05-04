/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

withBundleAnalyzer({ enabled: true });

const nextConfig = {};

export default process.env.ANALYZE === "true"
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
