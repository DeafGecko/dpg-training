import { router } from "expo-router";
import { AlertCircle, LogIn } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DpgLogo from "../../assets/icons/dpg_brand_mark_color.svg";
import rawData from "../../data/Translation_camp.json";
import { setAuthSession } from "../utils/authSession";

const normalizeAccessKey = (value: string) =>
  value.replace(/[\u201c\u201d\u201e\u2018\u2019'"]/g, "").trim();

const collectAccessKeys = (data: any[]) => {
  const keys = new Set<string>();
  data.forEach((story) => {
    const rawKeys = story["access-keys"];
    if (rawKeys) {
      rawKeys
        .split(",")
        .map(normalizeAccessKey)
        .filter(Boolean)
        .forEach((k: string) => keys.add(k));
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
      setAuthSession(normalized);
      router.replace("/training");
    } else {
      setHasError(true);
    }
  };

  return (
    <View style={styles.container}>
      <DpgLogo width={320} height={320} />
      <View style={styles.titleRow}>
        <LogIn size={18} color="#46697C" />
        <Text style={styles.title}>Login</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Access Key"
        placeholderTextColor="#b0b0b0"
        value={enteredKey}
        onChangeText={setEnteredKey}
        autoCapitalize="characters"
        onSubmitEditing={submitAccessKey}
      />
      <TouchableOpacity
        style={[styles.button, hasError && styles.buttonError]}
        onPress={submitAccessKey}
      >
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
      {hasError && (
        <View style={styles.errorRow}>
          <AlertCircle size={16} color="#c0392b" />
          <Text style={styles.errorText}>Invalid key. Please try again.</Text>
        </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#46697C",
    marginLeft: 6,
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
  errorRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#c0392b",
    fontSize: 14,
    marginLeft: 6,
  },
});
