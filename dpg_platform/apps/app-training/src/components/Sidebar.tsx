import { Contrast, Moon, Settings, Sun } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import JesusIcon from "../../assets/icons/topics/T-01/555-jesus.svg";
import ChurchIcon from "../../assets/icons/topics/T-02/555-church.svg";
import MissionIcon from "../../assets/icons/topics/T-03/555-mission.svg";
import DeafPathwayLogo from "../../assets/icons/deafpathway_colorblack.svg";
import DeafPathwayLogoDark from "../../assets/icons/dpg-darkmode.svg";
import DeafPathwayLogoHighContrast from "../../assets/icons/dpg-highcontrast_mode.svg";
import { ThemeType } from "../hooks/use-theme";

const TOPICS = [
  { id: "T-01", 
    line1: "Jesus", 
    line2: "Foundation Stories", 
    Icon: JesusIcon },
  {
    id: "T-02",
    line1: "Church",
    line2: "Foundation Stories",
    Icon: ChurchIcon,
  },
  { 
    id: "T-03",
    line1: "Mission",
    line2: "Foundation Stories",
    Icon: MissionIcon,
  },
];

const THEMES: { key: ThemeType; label: string; Icon: any }[] = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "highContrast", label: "High Contrast", Icon: Contrast },
];

type SidebarProps = {
  activeTopic: string;
  onTopicSelect: (topicId: string) => void;
  colors: any;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onClose?: () => void;
};

export default function Sidebar({
  activeTopic,
  onTopicSelect,
  colors,
  theme,
  onThemeChange,
  onClose,
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);

  const softText = theme === "dark" ? "#c8c8c8" : theme === "highContrast" ? "#FFFF00" : "#1a3a4a";
  const softSecondary = theme === "dark" ? "#999999" : theme === "highContrast" ? "#FFFF00" : "#333333";
  const borderColor = theme === "dark" ? "#333333" : colors.backgroundElement;

  return (
    <View
      style={[
        styles.sidebar,
        {
          backgroundColor:
            theme === "dark" ? colors.backgroundElement : colors.background,
          borderRightColor: borderColor,
        },
      ]}
    >

{/* Header logo */}
      <View style={styles.header}>
        {onClose && (
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
            <Text style={[styles.closeBtnText, { color: softSecondary }]}>✕</Text>
          </Pressable>
        )}
        {theme === "highContrast"
          ? <DeafPathwayLogoHighContrast width={180} height={50} />
          : theme === "dark"
          ? <DeafPathwayLogoDark width={180} height={50} />
          : <DeafPathwayLogo width={180} height={50} />
        }
      </View>

{/* Topic buttons */}
      <View style={{ flex: 1 }}>
        {TOPICS.map(({ id, line1, line2, Icon }) => {
          const isActive = activeTopic === id;
          return (
            <Pressable
              key={id}
              style={({ pressed }) => [
                styles.topicRow,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => onTopicSelect(id)}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive, isActive && theme === "highContrast" && { borderColor: "#FFFF00" }]}>

{/* The icon is wrapped in a View to allow for the border styling. */}
                <Icon
                  width={80}
                  height={100}
                  color={theme === "highContrast" ? "#FFFF00" : undefined}
                />
              </View>
              <Text style={[styles.topicTitle, { color: softText }]}>
                {line1}
              </Text>
              <Text style={[styles.topicSubtitle, { color: softSecondary }]}>
                {line2}
              </Text>
            </Pressable>
          );
        })}
      </View>

{/* Settings button at bottom */}
      <Pressable
        style={({ pressed }) => [
          styles.settingsBtn,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() => setShowSettings(true)}
      >
        <Settings size={20} color={softSecondary} />
        <Text style={[styles.settingsLabel, { color: softSecondary }]}>
          Settings
        </Text>
      </Pressable>

{/* Theme picker modal */}
      <Modal visible={showSettings} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Display Theme</Text>
            {THEMES.map(({ key, label, Icon: ThemeIcon }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeRow,
                  theme === key && styles.themeRowActive,
                ]}
                onPress={() => {
                  onThemeChange(key);
                  setShowSettings(false);
                }}
              >
                <ThemeIcon
                  size={18}
                  color={theme === key ? "#4a6b7c" : "#555"}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    theme === key && styles.themeLabelActive,
                  ]}
                >
                  {label}
                </Text>
                {theme === key && <Text style={styles.themeCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    flexShrink: 0,
    alignSelf: "stretch",
    borderRightWidth: 2,
    borderRightColor: "#4a6b7c",
    backgroundColor: "#fff",
  },
  sidebarLogo: {
    width: 174,
    height: 60,
/* Use 'contain' so it never stretches, even if the container changes */
    resizeMode: "contain",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerLogo: {
    width: "80%",
    height: 60,
    alignSelf: "center",
  },
  topicRow: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  topicRowActive: {},
  iconWrapper: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: 10,
  },

/* Active topic icon wrapper with border */
  iconWrapperActive: {
    borderColor: "#b2a426",
    borderWidth: 4,
    margin: 0,
    padding: 0,
    width: 73,
    height: 105,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, 
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    color: "#1a3a4a",
  },
  topicSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
    color: "#222222",
  },

// Settings
  settingsBtn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  settingsLabel: {
    fontSize: 16,
    color: "#555555",
    fontWeight: "500",
    marginTop: 6,
  },

  
// Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    width: 240,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 14,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 12,
  },
  themeRowActive: {
    backgroundColor: "#f0f6f9",
  },
  themeLabel: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  themeLabelActive: {
    color: "#4a6b7c",
    fontWeight: "600",
  },
  themeCheck: {
    color: "#4a6b7c",
    fontSize: 16,
    fontWeight: "700",
  },
});
