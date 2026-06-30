import { VideoView, useVideoPlayer } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { parseMediaString } from "../utils/dataHelper";
import { ThemeType } from "../hooks/use-theme";

type Story = {
  story_title: string;
  "book-bible"?: string;
  ref?: string;
  exegesis_slides: string | null | undefined;
  sign_roots_videos: string | null | undefined;
};

const MEDIA_ASSETS: Record<string, { type: "image" | "video"; source: any }> = {
  "12_send_exe_01.png":         { type: "image", source: require("../../assets/media/slides/12_send_exe_01.png") },
  "521_talents_exe_01.png":     { type: "image", source: require("../../assets/media/slides/521_talents_exe_01.png") },
  "5000_fed_exe_01.png":        { type: "image", source: require("../../assets/media/slides/5000_fed_exe_.01.png") },
  "5000_fed_exe_02.png":        { type: "image", source: require("../../assets/media/slides/5000_fed_exe_.02.png") },
  "5000_fed_exe_05.png":        { type: "image", source: require("../../assets/media/slides/5000_fed_exe_.05.png") },
  "church_planting_exe_01.png": { type: "image", source: require("../../assets/media/slides/church_planting_exe_01.png") },
  "fellowship_exe_01.png":      { type: "image", source: require("../../assets/media/slides/fellowship_exe_01.png") },
  "go_disciple_exe_01.png":     { type: "image", source: require("../../assets/media/slides/go_disciple_exe_01.png") },
  "jesus_baptist_exe_01.png":   { type: "image", source: require("../../assets/media/slides/jesus_baptist_exe_01.png") },
  "jesus_pray_exe_01.png":      { type: "image", source: require("../../assets/media/slides/jesus_pray_exe_01.png") },
  "keys_exe_01.png":            { type: "image", source: require("../../assets/media/slides/keys_exe_01.png") },
  "keys_exe_02.png":            { type: "image", source: require("../../assets/media/slides/keys_exe_02.png") },
  "keys_exe_07.png":            { type: "image", source: require("../../assets/media/slides/keys_exe_07.png") },
  "king_xerexs_exe_01.png":     { type: "image", source: require("../../assets/media/slides/king_xerexs_exe_01.png") },
  "king_xerexs_exe_02.png":     { type: "image", source: require("../../assets/media/slides/king_xerexs_exe_02.png") },
  "last_meal_exe_01.png":       { type: "image", source: require("../../assets/media/slides/last_meal_exe_01.png") },
  "lazarus_exe_01.png":         { type: "image", source: require("../../assets/media/slides/lazarus_exe_01.png") },
  "new_queen_exe_01.png":       { type: "image", source: require("../../assets/media/slides/new_queen_exe_01.png") },
  "only_way_exe_01.png":        { type: "image", source: require("../../assets/media/slides/only_way_exe_01.png") },
  "only_way_exe_02.png":        { type: "image", source: require("../../assets/media/slides/only_way_exe_02.png") },
  "removed_queen_exe_01.png":   { type: "image", source: require("../../assets/media/slides/removed_queen_exe_01.png") },
  "s.a.f_exe_01.png":           { type: "image", source: require("../../assets/media/slides/s.a.f_exe_01.png") },
  "s.a.f_exe_02.png":           { type: "image", source: require("../../assets/media/slides/s.a.f_exe_02.png") },
  "sacifices_exe_01.png":       { type: "image", source: require("../../assets/media/slides/sacifices_exe_01.png") },
  "sacifices_exe_02.png":       { type: "image", source: require("../../assets/media/slides/sacifices_exe_02.png") },
  "salt_light_exe_01.png":      { type: "image", source: require("../../assets/media/slides/salt_light_exe_01.png") },
  "satan_3x_exe_01.png":        { type: "image", source: require("../../assets/media/slides/satan_3x_exe_01.png") },
  "shepherd_wolf_exe_01.png":   { type: "image", source: require("../../assets/media/slides/shepherd_wolf_exe_.01.png") },
  "true_vine_exe_01.png":       { type: "image", source: require("../../assets/media/slides/true_vine_exe_01.png") },
  "two_houses_exe_01.png":      { type: "image", source: require("../../assets/media/slides/two_houses_exe_.01.png") },
  "two_houses_exe_02.png":      { type: "image", source: require("../../assets/media/slides/two_houses_exe_.02.png") },
  "two_houses_exe_03.png":      { type: "image", source: require("../../assets/media/slides/two_houses_exe_.03.png") },
  "two_houses_exe_07.png":      { type: "image", source: require("../../assets/media/slides/two_houses_exe_.07.png") },
  "two_houses_exe_08.png":      { type: "image", source: require("../../assets/media/slides/two_houses_exe_.08.png") },
  "vashti_disobey_exe_01.png":  { type: "image", source: require("../../assets/media/slides/vashti_disobey_exe_01.png") },
  "watchman_exe_01.png":        { type: "image", source: require("../../assets/media/slides/watchman_exe_01.png") },
  "watchman_exe_02.png":        { type: "image", source: require("../../assets/media/slides/watchman_exe_02.png") },
  "watchman_exe_03.png":        { type: "image", source: require("../../assets/media/slides/watchman_exe_03.png") },
  "watchman_exe_07.png":        { type: "image", source: require("../../assets/media/slides/watchman_exe_07.png") },
  "watchman_exe_08.png":        { type: "image", source: require("../../assets/media/slides/watchman_exe_08.png") },
  "wise_foolish_exe_01.png":    { type: "image", source: require("../../assets/media/slides/wise_foolish_exe_01.png") },

  "5000_fed_exe_03.mp4":   { type: "video", source: require("../../assets/media/videos/5000_fed_exe_03.mp4") },
  "5000_fed_exe_04.mp4":   { type: "video", source: require("../../assets/media/videos/5000_fed_exe_04.mp4") },
  "5000_fed_exe_06.mp4":   { type: "video", source: require("../../assets/media/videos/5000_fed_exe_06.mp4") },
  "keys_exe_04.mp4":       { type: "video", source: require("../../assets/media/videos/keys_exe_04.mp4") },
  "keys_exe_05.mp4":       { type: "video", source: require("../../assets/media/videos/keys_exe_05.mp4") },
  "keys_exe_09.mp4":       { type: "video", source: require("../../assets/media/videos/keys_exe_09.mp4") },
  "two_houses_exe_04.mp4": { type: "video", source: require("../../assets/media/videos/two_houses_exe_04.mp4") },
  "two_houses_exe_05.mp4": { type: "video", source: require("../../assets/media/videos/two_houses_exe_05.mp4") },
  "two_houses_exe_06.mp4": { type: "video", source: require("../../assets/media/videos/two_houses_exe_06.mp4") },
  "two_houses_exe_09.mp4": { type: "video", source: require("../../assets/media/videos/two_houses_exe_09.mp4") },
  "watchman_exe_04.mp4":   { type: "video", source: require("../../assets/media/videos/watchman_exe_04.mp4") },
  "watchman_exe_05.mp4":   { type: "video", source: require("../../assets/media/videos/watchman_exe_05.mp4") },
  "watchman_exe_06.mp4":   { type: "video", source: require("../../assets/media/videos/watchman_exe_06.mp4") },
  "watchman_exe_09.mp4":   { type: "video", source: require("../../assets/media/videos/watchman_exe_09.mp4") },
};

const MOBILE_BREAKPOINT = 768;
const THUMB_W = 90;
const THUMB_H = 56;

function VideoItem({ source, style }: { source: any; style: any }) {
  const player = useVideoPlayer(source);
  return <VideoView player={player} style={style} nativeControls contentFit="contain" />;
}

export default function ContentPanel({ story, colors, theme }: { story: Story | null; colors: any; theme: ThemeType }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [pagerHeight, setPagerHeight] = useState(0);
  const [mode, setMode] = useState<"exegesis" | "videos">("exegesis");
  const { width, height } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  const isLandscape = width > height;
  const swipeRef = useRef<ScrollView>(null);
  const thumbRef = useRef<ScrollView>(null);

// Reset to first slide when story or mode changes
  useEffect(() => {
    setSlideIndex(0);
    swipeRef.current?.scrollTo({ x: 0, animated: false });
    thumbRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [story, mode]);

  if (!story) {
    return (
      <View style={[styles.container, { backgroundColor: theme === "light" ? "#e8e8e8" : theme === "dark" ? colors.backgroundElement : colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#555555", fontSize: 16 }}>Select a story from the top bar.</Text>
      </View>
    );
  }

  const allExegesisSlides = parseMediaString(story.exegesis_slides)
    .map((f) => MEDIA_ASSETS[f] ?? null)
    .filter(Boolean) as { type: "image" | "video"; source: any }[];

  const videoOnlySlides = allExegesisSlides.filter((s) => s.type === "video");

  const slides = mode === "videos" ? videoOnlySlides : allExegesisSlides;
  const hasVideos = videoOnlySlides.length > 0;

  const total = slides.length;
  const currentItem = slides[slideIndex];

  const goTo = (index: number) => {
    if (index < 0 || index >= total) return;
    setSlideIndex(index);
    if (isMobile) {
      swipeRef.current?.scrollTo({ x: index * width, animated: true });
    }

// scroll thumbnail strip to keep active thumb visible
    thumbRef.current?.scrollTo(
      isMobile
        ? { x: index * (THUMB_W + 10) - width / 2 + THUMB_W / 2, animated: true }
        : { y: index * (THUMB_H + 10) - 100, animated: true }
    );
  };

  const handleSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== slideIndex) {
      setSlideIndex(newIndex);
      thumbRef.current?.scrollTo({ x: newIndex * (THUMB_W + 10) - width / 2 + THUMB_W / 2, animated: true });
    }
  };

  const reference = [story["book-bible"], story.ref].filter(Boolean).join(" ");

  const titleColor = theme === "highContrast" ? "#FFFF00" : theme === "dark" ? "#c8c8c8" : "#1a3a4a";

  const activeColor = theme === "highContrast" ? "#FFFF00" : theme === "dark" ? "#2a4a5a" : "#4a6b7c";
  const activeTextColor = theme === "highContrast" ? "#000" : "#fff";
  const outlineBorderColor = theme === "dark" ? "#777777" : colors.text;
  const outlineTextColor = theme === "dark" ? "#c8c8c8" : colors.text;

// ── Mode toggle buttons ──
  const ModeButtons = () => (
    <View style={styles.headerButtons}>
      <TouchableOpacity
        onPress={() => setMode("exegesis")}
        style={[
          styles.headerBtn,
          mode === "exegesis"
            ? { backgroundColor: activeColor }
            : [styles.headerBtnOutline, { borderColor: outlineBorderColor }],
        ]}
      >
        <Text style={[styles.headerBtnText, { color: mode === "exegesis" ? activeTextColor : outlineTextColor }]}>
          Exegesis
        </Text>
      </TouchableOpacity>
      {hasVideos && (
        <TouchableOpacity
          onPress={() => setMode("videos")}
          style={[
            styles.headerBtn,
            mode === "videos"
              ? { backgroundColor: activeColor }
              : [styles.headerBtnOutline, { borderColor: outlineBorderColor }],
          ]}
        >
          <Text style={[styles.headerBtnText, { color: mode === "videos" ? activeTextColor : outlineTextColor }]}>
            Videos
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

// ── Nav arrows (used on desktop and landscape) ──
  const NavArrows = () => (
    <View style={styles.arrowStack}>
      <TouchableOpacity
        style={[styles.arrowBtn, { opacity: slideIndex === 0 ? 0.3 : 1 }]}
        onPress={() => goTo(slideIndex - 1)}
        disabled={slideIndex === 0}
      >
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.arrowBtn, { opacity: slideIndex === total - 1 ? 0.3 : 1 }]}
        onPress={() => goTo(slideIndex + 1)}
        disabled={slideIndex === total - 1}
      >
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );

// ── Video thumbnail with extracted frame ──
  const VideoThumb = ({ source }: { source: any }) => {
    const [uri, setUri] = useState<string | null>(null);
    useEffect(() => {
      VideoThumbnails.getThumbnailAsync(source, { time: 0 })
        .then((r) => setUri(r.uri))
        .catch(() => {});
    }, [source]);
    return (
      <View style={[styles.thumbnailMedia, styles.thumbnailVideo]}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : null}
        <Text style={styles.thumbnailVideoIcon}>▶</Text>
      </View>
    );
  };

// ── Thumbnail item ──
  const ThumbItem = ({ item, i }: { item: { type: "image" | "video"; source: any }; i: number }) => (
    <TouchableOpacity
      onPress={() => goTo(i)}
      style={[
        styles.thumbnail,
        { borderColor: theme === "highContrast" ? "#FFFF00" : theme === "dark" ? "#555555" : "#aaaaaa" },
        i === slideIndex && styles.thumbnailActive,
        i === slideIndex && theme === "highContrast" && { borderColor: "#FFFF00" },
        i !== slideIndex && { opacity: 0.35 },
      ]}
    >
      {item.type === "image" ? (
        <Image source={item.source} style={styles.thumbnailMedia} resizeMode="cover" />
      ) : (
        <VideoThumb source={item.source} />
      )}
    </TouchableOpacity>
  );

// ══════════════════════════════════════════
// MOBILE — portrait
// ══════════════════════════════════════════
  if (isMobile && !isLandscape) {
    return (
      <View style={[styles.container, { backgroundColor: "#111" }]}>
        {/* Header: title, reference, buttons */}
        <View style={[styles.headerBar, { backgroundColor: colors.backgroundElement ?? "#d6d4a8" }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.storyTitle, { color: titleColor }]} numberOfLines={1}>{story.story_title}</Text>
            {reference ? (
              <Text style={[styles.storyRef, { color: titleColor }]}>{reference}</Text>
            ) : null}
          </View>
          <ModeButtons />
        </View>

{/* Swipeable slide pager */}
        <View
          style={{ flex: 1, backgroundColor: "#111" }}
          onLayout={(e) => setPagerHeight(e.nativeEvent.layout.height)}
        >
          <ScrollView
            ref={swipeRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleSwipeEnd}
            style={{ flex: 1, backgroundColor: "#111" }}
            contentContainerStyle={{ backgroundColor: "#111" }}
          >
            {slides.map((item, i) => (
              <View key={i} style={{ width, height: pagerHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#111" }}>
                {item.type === "image" ? (
                  <Image source={item.source} style={{ width, height: pagerHeight }} resizeMode="contain" />
                ) : (
                  <VideoItem source={item.source} style={{ width, height: pagerHeight }} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

{/* Bottom thumbnail strip */}
        {total > 1 && (
          <View style={[styles.mobileThumbBar, { backgroundColor: colors.backgroundElement ?? "#1e1e1e" }]}>
            <ScrollView
              ref={thumbRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mobileThumbContent}
            >
              {slides.map((item, i) => <ThumbItem key={i} item={item} i={i} />)}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

// ══════════════════════════════════════════
// MOBILE — landscape (true fullscreen, arrows only)
// ══════════════════════════════════════════
  if (isMobile && isLandscape) {
    return (
      <View style={{ width, height, backgroundColor: "#000" }}>
        {/* Fullscreen swipeable pager */}
        <ScrollView
          ref={swipeRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSwipeEnd}
          style={StyleSheet.absoluteFill}
        >
          {slides.map((item, i) => (
            <View key={i} style={{ width, height, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
              {item.type === "image" ? (
                <Image source={item.source} style={{ width, height }} resizeMode="contain" />
              ) : (
                <VideoItem source={item.source} style={{ width, height }} />
              )}
            </View>
          ))}
        </ScrollView>

{/* Prev / Next arrows — bottom-right corner only */}
        {total > 1 && <NavArrows />}
      </View>
    );
  }

// ══════════════════════════════════════════
// DESKTOP — original layout with right strip
// ══════════════════════════════════════════
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Header bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.backgroundElement ?? "#d6d4a8" }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.storyTitle, { color: titleColor }]}>{story.story_title}</Text>
          {reference ? (
            <Text style={[styles.storyRef, { color: titleColor }]}>{reference}</Text>
          ) : null}
        </View>
        <ModeButtons />
      </View>

{/* Body: viewer + right thumbnail strip */}
      <View style={styles.body}>
        <View style={[styles.mainViewer, { backgroundColor: "#333333" }]}>
          {currentItem?.type === "image" && (
            <Image source={currentItem.source} style={styles.mainMedia} resizeMode="cover" />
          )}
          {currentItem?.type === "video" && (
            <VideoItem source={currentItem.source} style={styles.mainMedia} />
          )}
          {total === 0 && (
            <Text style={{ color: colors.text }}>No media for this story.</Text>
          )}
          {total > 1 && <NavArrows />}
        </View>

        {total > 0 && (
          <ScrollView
            ref={thumbRef}
            style={[styles.thumbnailStrip, { backgroundColor: colors.backgroundElement ?? "#d6d4a8" }]}
            contentContainerStyle={styles.thumbnailStripContent}
            showsVerticalScrollIndicator={false}
          >
            {slides.map((item, i) => <ThumbItem key={i} item={item} i={i} />)}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

// Header (desktop)
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: { 
    flex: 1, 
    marginRight: 12 
  },
  storyTitle: { 
    fontSize: 18, 
    fontWeight: "700" 
  },
  storyRef: { 
    fontSize: 13, 
    opacity: 0.7, 
    marginTop: 2 
  },
  headerButtons: { 
    flexDirection: "row", 
    gap: 8 
  },
  headerBtn: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 6 
  },
  headerBtnOutline: { 
    backgroundColor: "transparent", 
    borderWidth: 1.5 
  },
  headerBtnText: { 
    color: "#fff", 
    fontSize: 13, 
    fontWeight: "600" 
  },

// Body (desktop)
  body: { 
    flex: 1, 
    flexDirection: "row", 
    backgroundColor: "#333333" 
  },
  mainViewer: {
    flex: 1,
    margin: 12,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  mainMedia: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 8 
  },

// Arrows — desktop (vertical) + landscape (horizontal, bottom-right)
  arrowStack: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "700", 
    lineHeight: 28 
  },

// Desktop thumbnail strip (vertical, right side)
  thumbnailStrip: { 
    width: 110, 
    flexShrink: 0, 
    flexGrow: 0 
  },
  thumbnailStripContent: { 
    alignItems: "center", 
    paddingVertical: 8 
  },

// Shared thumbnail
  thumbnail: {
    marginBottom: 8,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#aaaaaa",
  },
  thumbnailActive: { 
    borderColor: "#b2a426", 
    borderWidth: 3 
  },
  thumbnailMedia: { 
    width: THUMB_W, 
    height: THUMB_H },
  thumbnailVideo: { 
    backgroundColor: "#222", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  thumbnailVideoIcon: { 
    color: "#fff", 
    fontSize: 20 
  },

// Mobile portrait thumbnail bar (horizontal, bottom)
  mobileThumbBar: {
    height: THUMB_H + 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  mobileThumbContent: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    gap: 8,
  },

// Landscape overlays
  landscapeTitleOverlay: {
    position: "absolute",
    top: 12,
    left: 16,
  },
  landscapeTitle: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.8,
  },
});
