import { Component } from "react";
import { View, Text, Pressable } from "react-native";
import type { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="items-center rounded-xl border border-border bg-bg-surface px-4 py-6">
          <Text className="mb-2 text-base font-semibold text-text">
            Something went wrong
          </Text>
          <Text className="mb-4 text-center text-[13px] text-text-2">
            This content couldn&apos;t be displayed.
          </Text>
          <Pressable
            onPress={this.handleReset}
            className="rounded-md bg-brand px-4 py-2"
          >
            <Text className="text-[13px] font-bold text-text-inv">
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
