/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScriptのエラーは本番環境でも無視しない
    ignoreBuildErrors: false
  },
  eslint: {
    // ESLintのエラーは本番環境でも無視しない
    ignoreDuringBuilds: false
  },
  env: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID
  },
  webpack: (config, { isServer }) => {
    // wasmファイルとzkeyファイルの処理設定
    config.module.rules.push({
      test: /\.(wasm|zkey)$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name].[hash][ext]"
      }
    })

    // snarkjsの外部化（サーバーサイドのみ）
    if (isServer) {
      config.externals.push("snarkjs")
    }

    // ファイルシステム関連のfallback設定
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false
    }

    return config
  },
  experimental: {
    turbo: {
      // TurboPack設定（必要に応じて）
    }
  }
}

module.exports = nextConfig
