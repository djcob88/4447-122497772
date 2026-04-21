// Login screen taken from FYP project modified to fit local backend rather than external Python backend and removed React Native Paper library
import React, { useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";        
import { useAuth } from "@/context/authcontext"; 
import { db } from "@/db/client"; 
import { users } from "@/db/schema"; 
import ScreenHeader from "@/components/ui/screen-header"; 
import FormField from "@/components/ui/form-field"; 
import PrimaryButton from "@/components/ui/primary-button"; 

export default function LoginScreen() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const { setUser, user } = useAuth(); 
  const router = useRouter(); 
  const login = async () => { 
    if (user) {
      Alert.alert("You are currently logged in");
      return;
    }

    setLoading(true);
    try {
      const all = await db.select().from(users);
      const search = all.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password.trim()
      );
      if (!search) { Alert.alert("Login failed", "Invalid email or password");
        setLoading(false);
        return;
      }

        setUser({
          id: search.id,
          firstname: search.firstname,
          lastname: search.lastname,
          email: search.email,
        });
      router.replace("/" as any);

    } catch { Alert.alert("Error", "Could not log in");
    } finally { setLoading(false);}
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <View style={styles.containerCentered}>
        <View style={styles.card}>
          <ScreenHeader title="Login" subtitle="Log in to your account"/>

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
            label={loading ? "Logging in..." : "Login"} onPress={login}/>
          <View style={styles.secondaryButton}>
            <PrimaryButton 
            label="Go to Sign Up" variant="secondary" onPress={() => router.push("/register" as any)}/>
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
      paddingHorizontal: 20,
      paddingTop: 40,
      backgroundColor: "#F8FAFC",
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 24,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    formGroup: {
      marginBottom: 14,
    },
    secondaryButton: {
      marginTop: 6,
    },
  });
// End
