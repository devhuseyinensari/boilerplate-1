import { apiFetch } from "@/lib/api-client";
import { signOut, useSession } from "@/lib/auth-client";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Me = { id: string; name: string; email: string };

export default function DashboardScreen() {
  const { data: session, isPending } = useSession();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session]);

  useEffect(() => {
    if (session) {
      apiFetch<Me>("/api/me").then(setMe);
    }
  }, [session]);

  if (isPending || !session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Yukleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.text}>
        Hosgeldin, {me?.name} ({me?.email})
      </Text>
      <Pressable
        style={styles.button}
        onPress={async () => {
          await signOut();
          router.replace("/login");
        }}
      >
        <Text style={styles.buttonText}>Cikis Yap</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  text: { fontSize: 14, color: "#475569" },
  button: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
