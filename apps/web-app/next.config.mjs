/** @type {import('next').NextConfig} */

import { config } from "dotenv"
import fs from "fs"
import withPWA from "next-pwa"

if (!fs.existsSync("./.env")) {
  config({ path: "../../.env" })
}

// PWAの設定
const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development"
})({
  env: {
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY,
    GELATO_RELAYER_API_KEY: process.env.GELATO_RELAYER_API_KEY
  }
})

export default nextConfig
