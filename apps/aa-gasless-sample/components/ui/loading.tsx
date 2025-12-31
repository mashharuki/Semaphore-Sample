import React from "react"
import { cn } from "../../lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * カッコいいローディングスピナーコンポーネント
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* メインのスピナー */}
        <div
          className={cn(
            "rounded-full border-2 border-gray-200 animate-spin",
            "border-t-blue-600 border-r-purple-600",
            sizeClasses[size]
          )}
        />

        {/* 内側のグロー効果 */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent animate-spin",
            "bg-gradient-to-r from-blue-400 to-purple-600 opacity-20",
            sizeClasses[size]
          )}
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
      </div>
    </div>
  )
}

interface LoadingScreenProps {
  message?: string
  className?: string
}

/**
 * フルスクリーンローディング画面コンポーネント
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading...", className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center z-50",
        "animate-fade-in",
        className
      )}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

/**
 * ローディング状態を表示するボタンコンポーネント
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, children, className, disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex items-center justify-center",
        "px-4 py-2 rounded-md text-white font-medium",
        "bg-blue-600 hover:bg-blue-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      <span className={cn(isLoading && "opacity-70")}>{children}</span>
    </button>
  )
}
