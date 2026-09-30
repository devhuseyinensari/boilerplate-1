import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Fullstack Boilerplate</Text>
      <Text style={styles.subtitle}>Expo + better-auth</Text>
      <View style={styles.links}>
        <Link href="/login" style={styles.link}>
          Giris Yap
        </Link>
        <Link href="/register" style={styles.link}>
          Kayit Ol
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#475569" },
  links: { flexDirection: "row", gap: 16, marginTop: 24 },
  link: { fontSize: 16, fontWeight: "500", color: "#0f172a", textDecorationLine: "underline" },
});
