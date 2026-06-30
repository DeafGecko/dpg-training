import { useState, useMemo } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import rawData from "../../data/Translation_camp.json";
import DpgLogo from "../../assets/icons/dpg_brand_mark_color.svg";

const normalizeAccessKey = (value: string) => value.replace(/[\u201c\u201d\u201e\u2018\u2019']/g, "").trim();

const collectAccessKeys = (data: any[]) => {
  const keys = new Set<string>();
  data.forEach((story) => {
    const rawKeys = story["access-keys"];
    if (rawKeys) {
      rawKeys.split(",").map(normalizeAccessKey).filter(Boolean).forEach((k: string) => keys.add(k));
    }
  });
  return keys;
};

export default function Login() {
  const [enteredKey, setEnteredKey] = useState("");
  const [hasError, setHasError] = useState(false);
  const validAccessKeys = useMemo(() => collectAccessKeys(rawData), []);

  const submitAccessKey = () => {
    const normalized = normalizeAccessKey(enteredKey);

    if (validAccessKeys.has(normalized)) {
      setHasError(false);
      router.replace("/training");
    } else {
      setHasError(true);
    }
  };

  return (
    <View style={styles.container}>
      <DpgLogo width={320} height={320} />
      <Text style={styles.title}>Login Portal</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Access Key"
        value={enteredKey}
        onChangeText={setEnteredKey}
        autoCapitalize="characters"
        onSubmitEditing={submitAccessKey}
      />
      <TouchableOpacity style={[styles.button, hasError && styles.buttonError]} onPress={submitAccessKey}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
      {hasError && (
        <Text style={styles.errorText}>Invalid key. Please try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e2e2",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#46697C",
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    maxWidth: 250,
    padding: 10,
    borderWidth: 2,
    borderColor: "#b2a426",
    borderRadius: 999,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#46697C",
  },
  button: {
    marginTop: 16,
    width: "80%",
    maxWidth: 250,
    padding: 14,
    borderRadius: 999,
    backgroundColor: "#46697C",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonError: {
    backgroundColor: "#c0392b",
  },
  errorText: {
    color: "#c0392b",
    fontSize: 14,
    marginTop: 12,
  },
});
