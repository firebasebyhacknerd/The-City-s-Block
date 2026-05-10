import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // TypeScript passes with zero errors — enforced at build time
    ignoreBuildErrors: false,
  },
  eslint: {
    // Known Next.js 15 + ESLint 9 flat-config circular JSON bug in eslint-config-next.
    // Run `npx eslint src/` manually to lint. Remove this once upstream is fixed.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
