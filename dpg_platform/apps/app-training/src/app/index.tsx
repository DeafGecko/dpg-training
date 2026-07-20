import { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

// Correct path to reach the assets folder from src/app/
import DpgBrandMark from "../../assets/icons/dpg_brand_mark_color.svg"; 

export default function EntryGate() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Using your brand mark icon */}
        <DpgBrandMark width={750} height={300} />
      </View>

      <Text style={styles.label}>Enter Access Key</Text>
      <TextInput 
        secureTextEntry 
        style={styles.input}
        placeholder=""
        onChangeText={(text) => {
          if (text === "July-26") {
            router.replace("/training");
          }
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#ffffff" 
  },
  logoContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 12,
    marginBottom: 10,
    color: "#333333",
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 12,
    width: 220,
    borderRadius: 8,
    textAlign: 'center'
  }
});