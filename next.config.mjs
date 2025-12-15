/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
// Respetar basePath vacío ("") si se define en el entorno; si no se define, usar fallback en GH Actions
const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH
const basePath = envBasePath !== undefined ? envBasePath : (isGithubActions && repoName ? `/${repoName}` : '')

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: basePath || undefined,
  basePath: basePath || undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
