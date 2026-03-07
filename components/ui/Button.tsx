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
  const baseClasses = "items-center justify-center rounded-full";

  const variantClasses = {
    primary: "bg-brand",
    outline: "border-[1.5px] border-border bg-transparent",
  };

  const sizeClasses = {
    default: "px-[18px] py-[10px]",
    sm: "px-4 py-2",
  };

  const textVariantClasses = {
    primary: "text-text-inv font-medium",
    outline: "text-text font-medium",
  };

  const textSizeClasses = {
    default: "text-[13px]",
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
