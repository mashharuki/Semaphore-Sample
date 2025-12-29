import "@nomicfoundation/hardhat-toolbox"
import "@semaphore-protocol/hardhat"
import { getHardhatNetworks } from "@semaphore-protocol/utils"
import { config as dotenvConfig } from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import { resolve } from "path"
import "./tasks/deploy"

// .env ファイルから環境変数を読み込みます
dotenvConfig({ path: resolve(__dirname, "../../.env") })

/**
 * Hardhatの設定ファイル
 */
const config: HardhatUserConfig = {
    solidity: "0.8.23",
    // デフォルトのネットワークを environment variable から取得、なければ 'hardhat' (ローカル) を使用
    defaultNetwork: process.env.DEFAULT_NETWORK || "hardhat",
    networks: {
        hardhat: {
            chainId: 1337 // ローカル開発用のチェーンID
        },
        // Semaphoreユーティリティを使用して、各種ネットワーク設定を自動生成
        ...getHardhatNetworks(process.env.ETHEREUM_PRIVATE_KEY)
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        target: "ethers-v6"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    sourcify: {
        enabled: true
    }
}

export default config
