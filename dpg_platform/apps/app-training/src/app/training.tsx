import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import ContentPanel from "../components/ContentPanel";
import Sidebar, { ALL_TOPICS } from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useThemeManager } from "../hooks/use-theme";
import rawData from "../../data/Translation_camp.json";

const normalizeKey = (v: string) => v.replace(/[“”„‘’']/g, "").trim();

function getUnlockedTopics(accessKey: string) {
  const unlockedIds = new Set<string>();
  (rawData as any[]).forEach((story) => {
    const raw = story["access-keys"];
    if (!raw) return;
    const keys = raw.split(",").map(normalizeKey).filter(Boolean);
    if (keys.includes(accessKey)) unlockedIds.add(story.theme_id);
  });
  return ALL_TOPICS.filter((t) => unlockedIds.has(t.id));
}

const MOBILE_BREAKPOINT = 768;
const DRAWER_WIDTH = 260;

export default function Training() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const { colors, theme, setTheme } = useThemeManager();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const { width, height } = useWindowDimensions();

  const isMobile = width < MOBILE_BREAKPOINT;
  const isLandscape = width > height;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("auth")) {
        router.replace("/login");
      } else {
        setAuthed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      slideAnim.setValue(-DRAWER_WIDTH);
      setDrawerOpen(false);
      setDrawerMounted(false);
    }
  }, [isMobile]);

  if (!authed) return null;

  const accessKey = typeof window !== "undefined" ? sessionStorage.getItem("accessKey") ?? "" : "";
  const unlockedTopics = getUnlockedTopics(accessKey);
  const topicStories = activeTopic ? rawData.filter((s: any) => s.theme_id === activeTopic) : [];

  const openDrawer = () => {
    setDrawerMounted(true);
    setDrawerOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 0,
      speed: 20,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setDrawerOpen(false);
      setDrawerMounted(false);
    });
  };

  const handleTopicSelect = (topicId: string) => {
    setActiveTopic(topicId);
    setActiveStory(null);
    if (isMobile) closeDrawer();
  };

  const sidebar = (
    <Sidebar
      topics={unlockedTopics}
      activeTopic={activeTopic}
      onTopicSelect={handleTopicSelect}
      colors={colors}
      theme={theme}
      onThemeChange={setTheme}
      onClose={isMobile ? closeDrawer : undefined}
    />
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Desktop: inline sidebar */}
      {!isMobile && sidebar}

      {/* Mobile: left-to-right slide drawer */}
      {isMobile && drawerMounted && (
        <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer}>
          <View style={styles.drawerOverlay}>
            {/* Dim backdrop */}
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
            {/* Sliding panel */}
            <Animated.View
              style={[styles.drawerSheet, { transform: [{ translateX: slideAnim }] }]}
            >
              {sidebar}
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Main content area */}
      <View style={styles.main}>
        {!(isMobile && isLandscape) && (
          <TopBar
            stories={topicStories}
            onStorySelect={setActiveStory}
            activeStory={activeStory}
            colors={colors}
            theme={theme}
            onHamburgerPress={isMobile ? openDrawer : undefined}
          />
        )}
        <ContentPanel story={activeStory} colors={colors} theme={theme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  main: {
    flex: 1,
    flexDirection: "column",
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawerSheet: {
    width: DRAWER_WIDTH,
    alignSelf: "stretch",
    zIndex: 10,
  },
});
