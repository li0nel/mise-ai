import { Pressable, Text } from "react-native";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  size?: "default" | "sm";
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  onPress,
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseClasses = "items-center justify-center rounded-md";

  const variantClasses = {
    primary: "bg-brand",
    outline: "border border-border bg-transparent",
  };

  const sizeClasses = {
    default: "h-[50px] px-6",
    sm: "h-9 px-4",
  };

  const textVariantClasses = {
    primary: "text-text-inv font-bold",
    outline: "text-text font-semibold",
  };

  const textSizeClasses = {
    default: "text-[15px]",
    sm: "text-[13px]",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {typeof children === "string" ? (
        <Text
          className={`${textVariantClasses[variant]} ${textSizeClasses[size]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
