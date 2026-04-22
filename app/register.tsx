// Register screen taken from FYP project modified to fit local backend rather than external Python backend and removed React Native Paeper library
import React, { useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import ScreenHeader from "@/components/ui/screen-header";
import FormField from "@/components/ui/form-field";
import PrimaryButton from "@/components/ui/primary-button";

export default function RegisterScreen() {
    const router = useRouter();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleRegister = async () => {
        if (!firstname || !lastname || !email || !password) {
           return Alert.alert("Missing Info", "Please fill in all fields");
        }
        setLoading(true);

        try {
            const existingUser = await db.select().from(users);
            const existingEmail = existingUser.some(user => user.email === email.trim().toLowerCase());
            if (existingEmail) {
                return Alert.alert("Sign up failed", "An account with this email already exists");}
            await db.insert(users).values({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                email: email.trim().toLowerCase(),
                password: password.trim()
            });

            Alert.alert("Account created", "You can now log in", [
                {
                    text: "OK",
                    onPress: () => router.push("/login")
                }
            ]);
        } catch {
            Alert.alert("Error", "Could not create account");
        } finally {
            setLoading(false);
        }};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <View style={styles.containerCentered}>
        <View style={styles.card}>
          <ScreenHeader title="Create account" subtitle="Create an account to plan your trips" />
          <View style={styles.formGroup}>
            <FormField
              label="First Name"
              value={firstname}
              onChangeText={setFirstname}
            />
          </View>

          <View style={styles.formGroup}>
            <FormField
              label="Last Name"
              value={lastname}
              onChangeText={setLastname}
            />
          </View>
          <View style={styles.formGroup}>
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.formGroup}>
            <FormField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <PrimaryButton
            label={loading ? "Creating..." : "Create Account"}
            onPress={handleRegister}
          />
          <View style={styles.secondaryButton}>
            <PrimaryButton
              label="Back to Login"
              variant="secondary"
              onPress={() => router.push("/login")}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: "#F8FAFC",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  title: {
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 18,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#0a101d",
  },
  primaryButton: {
    marginTop: 10,
    paddingVertical: 6,
  },
  secondaryButton: {
    marginTop: 10,
  },
});
