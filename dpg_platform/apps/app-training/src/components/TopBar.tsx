import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SvgProps } from "react-native-svg";
import DpgHandsWhite from "../../assets/icons/dpg-hands-white.svg";

// T-01 Jesus
import Fed5000 from "../../assets/icons/topics/T-01/5000_fed.svg";
import LazarusLive from "../../assets/icons/topics/T-01/lazarus_live.svg";
import OneWay from "../../assets/icons/topics/T-01/one_way.svg";
import ShepherdWolf from "../../assets/icons/topics/T-01/shepherd_wolf.svg";
import TwoHouses from "../../assets/icons/topics/T-01/two_houses.svg";
import VineBranches from "../../assets/icons/topics/T-01/vine_branches.svg";

// T-02 Church
import GivingSacrifices from "../../assets/icons/topics/T-02/giving_sacrifices.svg";
import JesusBaptized from "../../assets/icons/topics/T-02/jesus_baptized.svg";
import JesusPray from "../../assets/icons/topics/T-02/jesus_pray.svg";
import LordSupper from "../../assets/icons/topics/T-02/lord_supper.svg";
import SatanTempt from "../../assets/icons/topics/T-02/satan_tempt.svg";

// T-03 Mission
import Send12 from "../../assets/icons/topics/T-03/12_send.svg";
import Talents521 from "../../assets/icons/topics/T-03/5•2•1_talents.svg";
import GreatCommission from "../../assets/icons/topics/T-03/great_commission.svg";
import SaltLight from "../../assets/icons/topics/T-03/salt_light.svg";
import Warning from "../../assets/icons/topics/T-03/warning.svg";

// B-17 Esther (PNG)
const ESTHER_PNG: Record<string, any> = {
  "B-17-1": require("../../assets/icons/topics/B-17/17.001.001-009.png"),
  "B-17-2": require("../../assets/icons/topics/B-17/17.001.010-012.png"),
  "B-17-3": require("../../assets/icons/topics/B-17/17.001.013-022.png"),
  "B-17-4": require("../../assets/icons/topics/B-17/17.002.001-004.png"),
  "B-17-5": require("../../assets/icons/topics/B-17/17.002.005-011.png"),
  "B-17-6": require("../../assets/icons/topics/B-17/17.002.012-014.png"),
  "B-17-7": require("../../assets/icons/topics/B-17/17.002.015-018.png"),
  "B-17-8": require("../../assets/icons/topics/B-17/17.002.019-023.png"),
  "B-17-9": require("../../assets/icons/topics/B-17/17.003.001-006.png"),
  "B-17-10": require("../../assets/icons/topics/B-17/17.003.007-011.png"),
  "B-17-11": require("../../assets/icons/topics/B-17/17.003.012-015.png"),
  "B-17-12": require("../../assets/icons/topics/B-17/17.004.001-003.png"),
  "B-17-13": require("../../assets/icons/topics/B-17/17.004.004-011.png"),
  "B-17-14": require("../../assets/icons/topics/B-17/17.004.012-017.png"),
  "B-17-15": require("../../assets/icons/topics/B-17/17.005.001-008.png"),
  "B-17-16": require("../../assets/icons/topics/B-17/17.005.009-014.png"),
  "B-17-17": require("../../assets/icons/topics/B-17/17.006.001-011.png"),
  "B-17-18": require("../../assets/icons/topics/B-17/17.006.012-014.png"),
  "B-17-19": require("../../assets/icons/topics/B-17/17.007.001-008.png"),
  "B-17-20": require("../../assets/icons/topics/B-17/17.007.007-010.png"),
  "B-17-21": require("../../assets/icons/topics/B-17/17.008.001-002.png"),
  "B-17-22": require("../../assets/icons/topics/B-17/17.008.003-008.png"),
  "B-17-23": require("../../assets/icons/topics/B-17/17.008.009-014.png"),
  "B-17-24": require("../../assets/icons/topics/B-17/17.008.015.017.png"),
  "B-17-25": require("../../assets/icons/topics/B-17/17.009.001-010.png"),
  "B-17-26": require("../../assets/icons/topics/B-17/17.009.011-015.png"),
  "B-17-27": require("../../assets/icons/topics/B-17/17.009.016-019.png"),
  "B-17-28": require("../../assets/icons/topics/B-17/17.009.020-022.png"),
  "B-17-29": require("../../assets/icons/topics/B-17/17.009.023-028.png"),
  "B-17-30": require("../../assets/icons/topics/B-17/17.009.029-032.png"),
  "B-17-31": require("../../assets/icons/topics/B-17/17.010.001-003.png"),
};

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

export default function TopBar({
  stories = [],
  onStorySelect,
  activeStory,
  colors,
  theme,
  onHamburgerPress,
}: TopBarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const StoryIcons = ({
    iconSize,
    horizontal,
  }: {
    iconSize: number;
    horizontal: boolean;
  }) => (
    <>
      {stories.map((story) => {
        const isSelected = activeStory?.story_id === story.story_id;
        const iconKey = `${story.theme_id}-${story.story_id}`;
        const SvgIcon = STORY_ICON_MAP[iconKey];
        const pngSource = ESTHER_PNG[iconKey];
        return (
          <TouchableOpacity
            key={story.story_id}
            style={[
              styles.iconCircle,
              {
                width: iconSize,
                height: iconSize,
                borderRadius: iconSize / 2,
                borderColor: isSelected
                  ? theme === "highContrast"
                    ? "#FFFF00"
                    : "#b2a426"
                  : "#333333",
                borderWidth: isSelected
                  ? theme === "highContrast"
                    ? 5
                    : 4
                  : 2,
                opacity: !isSelected && !!activeStory ? 0.35 : 1,
                marginHorizontal: horizontal ? 4 : 5,
              },
            ]}
            onPress={() => onStorySelect(story)}
          >
            {pngSource ? (
              <Image
                source={pngSource}
                style={{ width: iconSize, height: iconSize }}
                resizeMode="cover"
              />
            ) : SvgIcon ? (
              <SvgIcon width={iconSize} height={iconSize} />
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

          <View pointerEvents="none" style={styles.mobileLogoWrap}>
            <View style={styles.mobileLogoBox}>
              <DpgHandsWhite width={36} height={36} />
            </View>
          </View>
        </View>

        {/* Story icons row below the blue bar */}
        {stories.length > 0 && (
          <View
            style={[
              styles.mobileIconRow,
              { backgroundColor: colors.backgroundElement ?? "#e8e8e8" },
            ]}
          >
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
    <View
      style={[
        styles.desktopHeader,
        { backgroundColor: theme === "highContrast" ? "#cccccc" : "#4a6b7c" },
      ]}
    >
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
