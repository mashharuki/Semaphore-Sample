import type React from "react"
import { Toaster } from "react-hot-toast"

interface ToasterProviderProps {
  children: React.ReactNode
}

/**
 * React Hot Toastの設定コンポーネント
 * @param children 子要素
 */
export const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // デフォルトの設定
          className: "",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          },

          // 成功時の設定
          success: {
            duration: 3000,
            style: {
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#fff"
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981"
            }
          },

          // エラー時の設定
          error: {
            duration: 5000,
            style: {
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              color: "#fff"
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EF4444"
            }
          },

          // 読み込み中の設定
          loading: {
            duration: Number.POSITIVE_INFINITY,
            style: {
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              color: "#fff"
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#3B82F6"
            }
          }
        }}
      />
    </>
  )
}
