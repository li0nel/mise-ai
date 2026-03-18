import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { PageHeader } from "../../components/ui/PageHeader";
import { PaywallModal } from "../../components/PaywallModal";
import { useAuth } from "../../contexts/AuthContext";

// ---------------------------------------------------------------------------
// Toggle Row — inline component for dietary preference switches
// ---------------------------------------------------------------------------

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center justify-between border-b border-border-subtle px-5 py-3.5"
    >
      <Text className="text-sm text-text">{label}</Text>
      <View
        className={`h-6 w-11 justify-center rounded-full ${value ? "bg-brand" : "bg-border"}`}
      >
        <View
          className="h-[20px] w-[20px] rounded-full bg-white shadow-xs"
          style={{ transform: [{ translateX: value ? 22 : 2 }] }}
        />
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Row — generic tappable or static row
// ---------------------------------------------------------------------------

function Row({
  label,
  labelClassName,
  right,
  onPress,
}: {
  label: string;
  labelClassName?: string;
  right?: string;
  onPress?: () => void;
}) {
  const content = (
    <View className="flex-row items-center justify-between border-b border-border-subtle px-5 py-3.5">
      <Text className={labelClassName ?? "text-sm text-text"}>{label}</Text>
      {right ? <Text className="text-sm text-text-2">{right}</Text> : null}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="px-5 pb-2 pt-6 text-[11px] font-bold uppercase tracking-wider text-text-3">
      {title}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// Settings Screen
// ---------------------------------------------------------------------------

const DIETARY_OPTIONS = [
  "Gluten-free",
  "Dairy-free",
  "Pescatarian",
  "Vegetarian",
  "Vegan",
  "Low Sodium",
  "Nut-free",
] as const;

type DietaryKey = (typeof DIETARY_OPTIONS)[number];

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  const [dietary, setDietary] = useState<Record<DietaryKey, boolean>>({
    "Gluten-free": false,
    "Dairy-free": false,
    Pescatarian: false,
    Vegetarian: false,
    Vegan: false,
    "Low Sodium": false,
    "Nut-free": false,
  });

  const toggleDietary = (key: DietaryKey) => {
    setDietary((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View className="flex-1 bg-bg">
      <PageHeader title="Settings" />

      <ScrollView className="flex-1" contentContainerClassName="pb-32">
        {/* ---- Dietary Profile ---- */}
        <SectionHeader title="DIETARY PROFILE" />
        <Text className="px-5 pb-3 text-[13px] text-text-2">
          Set your dietary preferences. Mise will automatically accommodate
          these in every recipe.
        </Text>
        {DIETARY_OPTIONS.map((option) => (
          <ToggleRow
            key={option}
            label={option}
            value={dietary[option]}
            onToggle={() => toggleDietary(option)}
          />
        ))}

        {/* ---- Account ---- */}
        <SectionHeader title="ACCOUNT" />
        <Row label="Email" right={user?.email ?? "—"} />
        <Row
          label="Sign Out"
          labelClassName="text-sm text-brand"
          onPress={() => {
            void signOut();
          }}
        />

        {/* ---- About ---- */}
        <SectionHeader title="ABOUT" />
        <Row label="Version" right="1.0.0" />
        <Row label="Send Feedback" labelClassName="text-sm text-brand" />
        <Row
          label="Preview Paywall"
          labelClassName="text-sm text-brand"
          onPress={() => setShowPaywall(true)}
        />
      </ScrollView>

      <PaywallModal
        visible={showPaywall}
        onDismiss={() => setShowPaywall(false)}
        onSubscribe={() => setShowPaywall(false)}
      />
    </View>
  );
}
