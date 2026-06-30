import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Text,
} from "react-native";
import { SvgProps } from "react-native-svg";
import DpgHandsWhite from "../../assets/icons/dpg-hands-white.svg";

// T-01 Jesus
import TwoHouses    from "../../assets/icons/topics/T-01/two_houses.svg";
import Fed5000      from "../../assets/icons/topics/T-01/5000_fed.svg";
import ShepherdWolf from "../../assets/icons/topics/T-01/shepherd_wolf.svg";
import LazarusLive  from "../../assets/icons/topics/T-01/lazarus_live.svg";
import OneWay       from "../../assets/icons/topics/T-01/one_way.svg";
import VineBranches from "../../assets/icons/topics/T-01/vine_branches.svg";

// T-02 Church
import JesusBaptized    from "../../assets/icons/topics/T-02/jesus_baptized.svg";
import SatanTempt       from "../../assets/icons/topics/T-02/satan_tempt.svg";
import GivingSacrifices from "../../assets/icons/topics/T-02/giving_sacrifices.svg";
import LordSupper       from "../../assets/icons/topics/T-02/lord_supper.svg";
import JesusPray        from "../../assets/icons/topics/T-02/jesus_pray.svg";

// T-03 Mission
import GreatCommission from "../../assets/icons/topics/T-03/great_commission.svg";
import Warning         from "../../assets/icons/topics/T-03/warning.svg";
import SaltLight       from "../../assets/icons/topics/T-03/salt_light.svg";
import Send12          from "../../assets/icons/topics/T-03/12_send.svg";
import Talents521      from "../../assets/icons/topics/T-03/5•2•1_talents.svg";

const STORY_ICON_MAP: Record<string, React.FC<SvgProps>> = {
  "T-01-1": TwoHouses,
  "T-01-2": Fed5000,
  "T-01-3": ShepherdWolf,
  "T-01-4": LazarusLive,
  "T-01-5": OneWay,
  "T-01-6": VineBranches,
  "T-02-2": JesusBaptized,
  "T-02-3": SatanTempt,
  "T-02-4": GivingSacrifices,
  "T-02-5": LordSupper,
  "T-02-6": JesusPray,
  "T-03-1": GreatCommission,
  "T-03-2": Warning,
  "T-03-3": SaltLight,
  "T-03-4": Send12,
  "T-03-6": Talents521,
};

type Story = {
  story_id: string | number;
  theme_id: string;
  story_title: string;
};

type TopBarProps = {
  stories: Story[];
  onStorySelect: (story: Story) => void;
  activeStory?: Story | null;
  colors: any;
  theme?: string;
  onHamburgerPress?: () => void;
};

const MOBILE_BREAKPOINT = 768;

export default function TopBar({ stories = [], onStorySelect, activeStory, colors, theme, onHamburgerPress }: TopBarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const StoryIcons = ({ iconSize, horizontal }: { iconSize: number; horizontal: boolean }) => (
    <>
      {stories.map((story) => {
        const isSelected = activeStory?.story_id === story.story_id;
        const iconKey = `${story.theme_id}-${story.story_id}`;
        const Icon = STORY_ICON_MAP[iconKey];
        return (
          <TouchableOpacity
            key={story.story_id}
            style={[
              styles.iconCircle,
              {
                width: iconSize,
                height: iconSize,
                borderRadius: iconSize / 2,
                borderColor: theme === "highContrast" && isSelected ? "#FFFF00" : "#333333",
                borderWidth: isSelected ? (theme === "highContrast" ? 5 : 3) : 2,
                opacity: !isSelected && !!activeStory ? 0.35 : 1,
                marginHorizontal: horizontal ? 4 : 5,
              },
            ]}
            onPress={() => onStorySelect(story)}
          >
            {Icon ? (
              <Icon width="100%" height="100%" />
            ) : (
              <Text style={{ color: colors.text, fontSize: 8 }}>
                {story.story_title.substring(0, 3)}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );

  // ── MOBILE ──
  if (isMobile) {
    return (
      <View>
        {/* Blue top bar: hamburger left, DPG hands icon centered */}
        <View style={styles.mobileHeader}>
          <TouchableOpacity
            onPress={onHamburgerPress}
            style={styles.hamburger}
            hitSlop={10}
            disabled={!onHamburgerPress}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>

          <View style={[styles.mobileLogoWrap, { pointerEvents: "none" }]}>
            <View style={styles.mobileLogoBox}>
              <DpgHandsWhite width={36} height={36} />
            </View>
          </View>
        </View>

        {/* Story icons row below the blue bar */}
        {stories.length > 0 && (
          <View style={[styles.mobileIconRow, { backgroundColor: colors.backgroundElement ?? "#e8e8e8" }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mobileIconScroll}
            >
              <StoryIcons iconSize={54} horizontal />
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  // ── DESKTOP ──
  return (
    <View style={[styles.desktopHeader, { backgroundColor: "#4a6b7c" }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.desktopScroll}
      >
        <StoryIcons iconSize={90} horizontal={false} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mobile top bar
  mobileHeader: {
    height: 60,
    backgroundColor: "#4a6b7c",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  hamburger: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hamburgerIcon: {
    fontSize: 24,
    color: "#ffffff",
    lineHeight: 28,
  },
  mobileLogoWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileLogoBox: {
    width: 36,
    height: 36,
    overflow: "hidden",
  },

  // Mobile story icons row (below bar)
  mobileIconRow: {
    height: 72,
    justifyContent: "center",
  },
  mobileIconScroll: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
  },

  // Desktop header
  desktopHeader: {
    height: 110,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  desktopScroll: {
    flexGrow: 1,
    alignItems: "center",
  },

  // Shared icon circle
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
});
