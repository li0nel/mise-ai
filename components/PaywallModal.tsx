import { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { CheckIcon, XIcon } from "./ui/Icons";

type Plan = "monthly" | "biannual" | "annual";

interface PlanOption {
  key: Plan;
  label: string;
  price: string;
  weekly: string;
  badge?: string;
}

const PLANS: readonly PlanOption[] = [
  { key: "monthly", label: "1 month", price: "$2.99", weekly: "$0.69/wk" },
  {
    key: "biannual",
    label: "6 months",
    price: "$11.49",
    weekly: "$0.44/wk",
    badge: "36% OFF",
  },
  {
    key: "annual",
    label: "1 year",
    price: "$19.99",
    weekly: "$0.38/wk",
    badge: "49% OFF",
  },
] as const;

const BENEFITS = [
  "Save unlimited recipes",
  "Adjust portions & servings",
  "Convert between metric & imperial",
  "Print & share recipes",
  "Support the Mise team",
  "Priority AI responses",
] as const;

interface PaywallModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubscribe: (plan: Plan) => void;
}

export function PaywallModal({
  visible,
  onDismiss,
  onSubscribe,
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 items-center justify-center bg-bg-overlay">
        <View className="mx-5 max-w-[400px] overflow-hidden rounded-2xl bg-bg-surface">
          <ScrollView bounces={false}>
            <View className="px-6 pb-6 pt-4">
              {/* Close button */}
              <View className="mb-6 flex-row justify-end">
                <Pressable
                  onPress={onDismiss}
                  className="h-8 w-8 items-center justify-center rounded-full bg-bg-elevated"
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <XIcon size={18} color="#6B6360" />
                </Pressable>
              </View>

              {/* Hero */}
              <View className="mb-8 items-center">
                <Text className="mb-2 text-center text-[28px] font-extrabold leading-tight text-text">
                  Cook smarter{"\n"}with{" "}
                  <Text className="text-brand">Mise Pro</Text>
                </Text>
                <Text className="text-[15px] text-text-2">
                  14 days free, then pick your plan.
                </Text>
              </View>

              {/* Promo card */}
              <View className="mb-7 rounded-xl border border-border bg-bg-surface p-6 shadow-md">
                {BENEFITS.map((benefit) => (
                  <View
                    key={benefit}
                    className="mb-4 flex-row items-center gap-3 last:mb-0"
                  >
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-brand-light">
                      <CheckIcon size={14} color="#C8481C" strokeWidth={3} />
                    </View>
                    <Text className="flex-1 text-[15px] font-medium text-text">
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Plan toggle */}
              <View className="mb-5 flex-row rounded-lg bg-bg-elevated p-1">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.key;
                  return (
                    <Pressable
                      key={plan.key}
                      onPress={() => setSelectedPlan(plan.key)}
                      className={`flex-1 items-center rounded-md px-2 py-3 ${
                        isSelected
                          ? "bg-bg-surface shadow-sm"
                          : "bg-transparent"
                      }`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text className="text-xs font-semibold text-text-2">
                        {plan.label}
                      </Text>
                      <Text className="text-lg font-extrabold text-text">
                        {plan.price}
                      </Text>
                      <Text className="text-[11px] text-text-3">
                        {plan.weekly}
                      </Text>
                      {plan.badge != null ? (
                        <View className="mt-1 rounded-full bg-brand-light px-1.5 py-0.5">
                          <Text className="text-[10px] font-bold text-brand">
                            {plan.badge}
                          </Text>
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>

              {/* CTA */}
              <Pressable
                onPress={() => onSubscribe(selectedPlan)}
                className="mb-3 h-14 items-center justify-center rounded-xl bg-brand"
                accessibilityRole="button"
              >
                <Text className="text-[17px] font-bold text-white">
                  Try free for 14 days
                </Text>
              </Pressable>

              {/* Skip link */}
              <Pressable
                onPress={onDismiss}
                className="mb-4 items-center py-2"
                accessibilityRole="button"
              >
                <Text className="text-sm font-medium text-text-3 underline">
                  Not now
                </Text>
              </Pressable>

              {/* Footer */}
              <Text className="text-center text-xs text-text-3">
                Cancel anytime in the App Store.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
