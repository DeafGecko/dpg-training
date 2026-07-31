import { useVideoPlayer, VideoView } from "expo-video";
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
import { ThemeType } from "../hooks/use-theme";
import { parseMediaString } from "../utils/dataHelper";

type Story = {
  story_title: string;
  "book-bible"?: string;
  ref?: string;
  storyboard_videos: string | null | undefined;
  sign_roots_videos: string | null | undefined;
  exegesis_slides: string | null | undefined;
};

const MOBILE_BREAKPOINT = 768;
const THUMB_W = 90;
const THUMB_H = 56;

const formatDropboxUrl = (url: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.includes("dropbox.com")) {
    return trimmed.replace("dl=0", "raw=1").replace("dl=1", "raw=1");
  }
  return trimmed;
};

const getVimeoEmbedUrl = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)(\/([a-f0-9]+))?/);
  if (!match) return null;
  const id = match[1];
  const hash = match[3];
  return hash
    ? `https://player.vimeo.com/video/${id}?h=${hash}&autoplay=0`
    : `https://player.vimeo.com/video/${id}?autoplay=0`;
};

const isExternalLink = (url: string) =>
  url.includes("t.me/") || url.includes("telegram");

function NativeVideoItem({ source, style }: { source: string; style: any }) {
  const player = useVideoPlayer(source);
  return (
    <VideoView
      player={player}
      style={style}
      nativeControls
      contentFit="contain"
    />
  );
}

function VideoItem({ source, style }: { source: string; style: any }) {
  const vimeoEmbed = getVimeoEmbedUrl(source);

  if (vimeoEmbed) {
    return (
      <View style={[style, { overflow: "hidden" }]}>
        {/* @ts-ignore — iframe is web-only */}
        <iframe
          src={vimeoEmbed}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </View>
    );
  }

  if (isExternalLink(source)) {
    return (
      <View
        style={[
          style,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1a1a2e",
          },
        ]}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 13,
            marginBottom: 12,
            textAlign: "center",
            paddingHorizontal: 16,
          }}
        >
          // This video is hosted on an external platform. Tap the button below
          to open it in your browser.
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (typeof window !== "undefined") window.open(source, "_blank");
          }}
          style={{
            backgroundColor: "#b2a426",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Open Video</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <NativeVideoItem source={source} style={style} />;
}

export default function ContentPanel({
  story,
  colors,
  theme,
}: {
  story: Story | null;
  colors: any;
  theme: ThemeType;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [pagerHeight, setPagerHeight] = useState(0);
  const [mode, setMode] = useState<"storyboard" | "signRoots" | "exegesis">(
    "storyboard",
  );
  const { width, height } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  const isLandscape = width > height;
  const swipeRef = useRef<ScrollView>(null);
  const thumbRef = useRef<ScrollView>(null);

  // Parse Storyboard and Sign Roots videos dynamically as URLs from the story object
  const storyboardSlides = parseMediaString(story?.storyboard_videos)
    .map((url) => formatDropboxUrl(url))
    .filter(Boolean)
    .map((source) => ({ type: "video" as const, source }));

  const signRootsSlides = parseMediaString(story?.sign_roots_videos)
    .map((url) => formatDropboxUrl(url))
    .filter(Boolean)
    .map((source) => ({ type: "video" as const, source }));

  const exegesisSlides = parseMediaString(story?.exegesis_slides)
    .map((url) => formatDropboxUrl(url))
    .filter(Boolean)
    .map((source) => ({ type: "video" as const, source }));

  // Default mode priority per story: Sign Roots -> Storyboard -> Exegesis
  useEffect(() => {
    if (signRootsSlides.length > 0) {
      setMode("signRoots");
      return;
    }
    if (storyboardSlides.length > 0) {
      setMode("storyboard");
      return;
    }
    if (exegesisSlides.length > 0) {
      setMode("exegesis");
    }
  }, [story]);

  // Reset to first slide when story or mode changes
  useEffect(() => {
    setSlideIndex(0);
    swipeRef.current?.scrollTo({ x: 0, animated: false });
    thumbRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [story, mode]);

  if (!story) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              theme === "light"
                ? "#e8e8e8"
                : theme === "dark"
                  ? colors.backgroundElement
                  : colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: "#555555", fontSize: 16 }}>
          Select a story from the top bar.
        </Text>
      </View>
    );
  }

  const slides =
    mode === "storyboard"
      ? storyboardSlides
      : mode === "signRoots"
        ? signRootsSlides
        : exegesisSlides;
  const hasStoryboard = storyboardSlides.length > 0;
  const hasSignRoots = signRootsSlides.length > 0;

  const total = slides.length;
  const currentItem = slides[slideIndex];

  const goTo = (index: number) => {
    if (index < 0 || index >= total) return;
    setSlideIndex(index);
    if (isMobile) {
      swipeRef.current?.scrollTo({ x: index * width, animated: true });
    }

    thumbRef.current?.scrollTo(
      isMobile
        ? {
            x: index * (THUMB_W + 10) - width / 2 + THUMB_W / 2,
            animated: true,
          }
        : { y: index * (THUMB_H + 10) - 100, animated: true },
    );
  };

  const handleSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== slideIndex) {
      setSlideIndex(newIndex);
      thumbRef.current?.scrollTo({
        x: newIndex * (THUMB_W + 10) - width / 2 + THUMB_W / 2,
        animated: true,
      });
    }
  };

  const reference = [story["book-bible"], story.ref].filter(Boolean).join(" ");
  const titleColor =
    theme === "highContrast"
      ? "#FFFF00"
      : theme === "dark"
        ? "#c8c8c8"
        : "#1a3a4a";
  const activeColor =
    theme === "highContrast"
      ? "#FFFF00"
      : theme === "dark"
        ? "#2a4a5a"
        : "#4a6b7c";
  const activeTextColor = theme === "highContrast" ? "#000" : "#fff";
  const outlineBorderColor = theme === "dark" ? "#777777" : colors.text;
  const outlineTextColor = theme === "dark" ? "#c8c8c8" : colors.text;

  // ── Mode toggle buttons (Exegesis | Storyboard | Sign Roots) ──
  const ModeButtons = () => (
    <View style={styles.headerButtons}>
      {exegesisSlides.length > 0 && (
        <TouchableOpacity
          onPress={() => setMode("exegesis")}
          style={[
            styles.headerBtn,
            mode === "exegesis"
              ? { backgroundColor: activeColor }
              : [styles.headerBtnOutline, { borderColor: outlineBorderColor }],
          ]}
        >
          <Text
            style={[
              styles.headerBtnText,
              {
                color: mode === "exegesis" ? activeTextColor : outlineTextColor,
              },
            ]}
          >
            Exegesis
          </Text>
        </TouchableOpacity>
      )}
      {hasStoryboard && (
        <TouchableOpacity
          onPress={() => setMode("storyboard")}
          style={[
            styles.headerBtn,
            mode === "storyboard"
              ? { backgroundColor: activeColor }
              : [styles.headerBtnOutline, { borderColor: outlineBorderColor }],
          ]}
        >
          <Text
            style={[
              styles.headerBtnText,
              {
                color:
                  mode === "storyboard" ? activeTextColor : outlineTextColor,
              },
            ]}
          >
            Storyboard
          </Text>
        </TouchableOpacity>
      )}
      {hasSignRoots && (
        <TouchableOpacity
          onPress={() => setMode("signRoots")}
          style={[
            styles.headerBtn,
            mode === "signRoots"
              ? { backgroundColor: activeColor }
              : [styles.headerBtnOutline, { borderColor: outlineBorderColor }],
          ]}
        >
          <Text
            style={[
              styles.headerBtnText,
              {
                color:
                  mode === "signRoots" ? activeTextColor : outlineTextColor,
              },
            ]}
          >
            Sign Roots
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        style={[
          styles.arrowBtn,
          { opacity: slideIndex === total - 1 ? 0.3 : 1 },
        ]}
        onPress={() => goTo(slideIndex + 1)}
        disabled={slideIndex === total - 1}
      >
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );

  const VideoThumb = ({ source }: { source: string }) => {
    const [uri, setUri] = useState<string | null>(null);
    const [frameSeeked, setFrameSeeked] = useState(false);

    useEffect(() => {
      setUri(null);
      setFrameSeeked(false);
    }, [source]);

    useEffect(() => {
      let cancelled = false;

      const setThumb = (next: string | null) => {
        if (!cancelled && next) setUri(next);
      };

      // Vimeo: use oEmbed API (supports private videos with hash)
      const vimeoMatch = source.match(/vimeo\.com\/(\d+)(\/([a-f0-9]+))?/);
      if (vimeoMatch) {
        const id = vimeoMatch[1];
        const hash = vimeoMatch[3];
        const oembedUrl = hash
          ? `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}/${hash}&width=200`
          : `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=200`;
        fetch(oembedUrl)
          .then((r) => r.json())
          .then((data) => {
            if (data.thumbnail_url) setThumb(data.thumbnail_url);
          })
          .catch(() => {});
        return () => {
          cancelled = true;
        };
      }

      // Web fallback: capture a frame from remote videos when possible.
      if (typeof document !== "undefined") {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;

        const cleanup = () => {
          video.removeEventListener("loadeddata", onLoadedData);
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
          video.src = "";
        };

        const capture = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = THUMB_W * 2;
            canvas.height = THUMB_H * 2;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setThumb(canvas.toDataURL("image/jpeg", 0.82));
          } catch {
            // Cross-origin restrictions can block canvas capture for some hosts.
          }
          cleanup();
        };

        const onLoadedData = () => {
          try {
            const t =
              Number.isFinite(video.duration) && video.duration > 0
                ? Math.min(8, Math.max(2, video.duration * 0.25))
                : 0;
            video.currentTime = t;
          } catch {
            capture();
          }
        };

        const onSeeked = () => capture();
        const onError = () => cleanup();

        video.addEventListener("loadeddata", onLoadedData);
        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        video.src = source;
        video.load();

        return () => {
          cancelled = true;
          cleanup();
        };
      }

      // Native only — no-op on web
      VideoThumbnails.getThumbnailAsync(source, { time: 0 })
        .then((r) => setThumb(r.uri))
        .catch(() => {});

      return () => {
        cancelled = true;
      };
    }, [source]);

    return (
      <View style={[styles.thumbnailMedia, styles.thumbnailVideo]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : typeof document !== "undefined" ? (
          // Web fallback: show a static frame without running playback.
          // @ts-ignore - video tag is supported in React Native Web.
          <video
            src={source}
            muted
            playsInline
            preload="metadata"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onLoadedData={(e: any) => {
              if (frameSeeked) return;
              const video = e?.currentTarget as HTMLVideoElement | undefined;
              if (!video) return;
              try {
                const t =
                  Number.isFinite(video.duration) && video.duration > 0
                    ? Math.min(8, Math.max(2, video.duration * 0.25))
                    : 0;
                video.currentTime = t;
                video.pause();
                setFrameSeeked(true);
              } catch {
                // Ignore seek failures; browser will keep first frame if available.
              }
            }}
          />
        ) : null}
        <View style={styles.thumbnailPlayOverlay}>
          <View style={styles.thumbnailPlayCircle}>
            <Text style={styles.thumbnailVideoIcon}>▶</Text>
          </View>
        </View>
      </View>
    );
  };

  const ThumbItem = ({
    item,
    i,
  }: {
    item: { type: "video"; source: string };
    i: number;
  }) => (
    <TouchableOpacity
      onPress={() => goTo(i)}
      style={[
        styles.thumbnail,
        {
          borderColor:
            theme === "highContrast"
              ? "#FFFF00"
              : theme === "dark"
                ? "#555555"
                : "#aaaaaa",
        },
        i === slideIndex && styles.thumbnailActive,
        i === slideIndex &&
          theme === "highContrast" && { borderColor: "#FFFF00" },
        i !== slideIndex && { opacity: 0.35 },
      ]}
    >
      <VideoThumb source={item.source} />
    </TouchableOpacity>
  );

  // ══════════════════════════════════════════
  // MOBILE — portrait
  // ══════════════════════════════════════════
  if (isMobile && !isLandscape) {
    return (
      <View style={[styles.container, { backgroundColor: "#111" }]}>
        <View
          style={[
            styles.headerBar,
            { backgroundColor: colors.backgroundElement ?? "#d6d4a8" },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text
              style={[styles.storyTitle, { color: titleColor }]}
              numberOfLines={1}
            >
              {story.story_title}
            </Text>
            {reference ? (
              <Text style={[styles.storyRef, { color: titleColor }]}>
                {reference}
              </Text>
            ) : null}
          </View>
          <ModeButtons />
        </View>

        <View
          style={{ flex: 1, backgroundColor: "#111" }}
          onLayout={(e) => setPagerHeight(e.nativeEvent.layout.height)}
        >
          {total > 0 ? (
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
                <View
                  key={i}
                  style={{
                    width,
                    height: pagerHeight,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#111",
                  }}
                >
                  <VideoItem
                    source={item.source}
                    style={{ width, height: pagerHeight }}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#888" }}>
                No media available for this mode.
              </Text>
            </View>
          )}
        </View>

        {total > 1 && (
          <View
            style={[
              styles.mobileThumbBar,
              { backgroundColor: colors.backgroundElement ?? "#1e1e1e" },
            ]}
          >
            <ScrollView
              ref={thumbRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mobileThumbContent}
            >
              {slides.map((item, i) => (
                <ThumbItem key={`${item.source}-${i}`} item={item} i={i} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  // ══════════════════════════════════════════
  // MOBILE — landscape
  // ══════════════════════════════════════════
  if (isMobile && isLandscape) {
    return (
      <View style={{ width, height, backgroundColor: "#000" }}>
        {total > 0 ? (
          <ScrollView
            ref={swipeRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleSwipeEnd}
            style={StyleSheet.absoluteFill}
          >
            {slides.map((item, i) => (
              <View
                key={i}
                style={{
                  width,
                  height,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                }}
              >
                <VideoItem source={item.source} style={{ width, height }} />
              </View>
            ))}
          </ScrollView>
        ) : null}
        {total > 1 && <NavArrows />}
      </View>
    );
  }

  // ══════════════════════════════════════════
  // DESKTOP
  // ══════════════════════════════════════════
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          { backgroundColor: colors.backgroundElement ?? "#d6d4a8" },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.storyTitle, { color: titleColor }]}>
            {story.story_title}
          </Text>
          {reference ? (
            <Text style={[styles.storyRef, { color: titleColor }]}>
              {reference}
            </Text>
          ) : null}
        </View>
        <ModeButtons />
      </View>

      <View style={styles.body}>
        <View style={[styles.mainViewer, { backgroundColor: "#333333" }]}>
          {currentItem?.type === "video" ? (
            <VideoItem
              key={currentItem.source}
              source={currentItem.source}
              style={styles.mainMedia}
            />
          ) : null}
          {total === 0 && (
            <Text style={{ color: "#fff" }}>
              No media available for this view.
            </Text>
          )}
          {total > 1 && <NavArrows />}
        </View>

        {total > 0 && (
          <ScrollView
            ref={thumbRef}
            style={[
              styles.thumbnailStrip,
              { backgroundColor: colors.backgroundElement ?? "#d6d4a8" },
            ]}
            contentContainerStyle={styles.thumbnailStripContent}
            showsVerticalScrollIndicator={false}
          >
            {slides.map((item, i) => (
              <ThumbItem key={`${item.source}-${i}`} item={item} i={i} />
            ))}
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
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  storyRef: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  headerBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
  headerBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#333333",
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
    borderRadius: 8,
  },
  arrowStack: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  arrowText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },
  thumbnailStrip: {
    width: 110,
    flexShrink: 0,
    flexGrow: 0,
  },
  thumbnailStripContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  thumbnail: {
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#aaaaaa",
  },
  thumbnailActive: {
    borderColor: "#b2a426",
    borderWidth: 3,
  },
  thumbnailMedia: {
    width: THUMB_W,
    height: THUMB_H,
  },
  thumbnailVideo: {
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailPlayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailVideoIcon: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 2,
  },
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
  },
});
