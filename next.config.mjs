/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Lint is run separately via `npm run lint`. We do not block production
        // builds on ESLint errors from legacy pages that will be refactored.
        // TypeScript type-checking remains enforced during the build.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
