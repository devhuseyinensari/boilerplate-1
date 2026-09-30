import { signUp } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterInput, registerSchema } from "@repo/shared";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterInput) => {
    setFormError(null);
    const { error } = await signUp.email(values);
    if (error) {
      setFormError(error.message ?? "Kayit basarisiz");
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kayit Ol</Text>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Isim"
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Sifre"
            secureTextEntry
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      {formError && <Text style={styles.error}>{formError}</Text>}

      <Pressable
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Kayit Ol</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#f8fafc",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  error: { color: "#dc2626", fontSize: 13 },
  button: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
