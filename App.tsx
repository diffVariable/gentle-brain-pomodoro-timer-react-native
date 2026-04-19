import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PHASE, PRESETS } from "./constants";
import useTimer from "./hooks/useTimer";
import { useFonts } from "expo-font";
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { theme } from "./constants/theme";
import Brain from "./components/Brain";
import { useEffect, useRef } from "react";

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const {
    start,
    timeShown,
    isTimerRunning,
    phase,
    skip,
    preset,
    pause,
    selectPreset,
    reset,
  } = useTimer();

  const handleTimerStartPausePress = () => {
    if (!isTimerRunning) {
      start();
    } else {
      pause();
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.pinkStrong} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />

        {/* header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Gentle Brain Pomodoro Timer</Text>
          <Text style={styles.presetLabel}>{preset.label}</Text>
        </View>

        {/* timer display */}
        <View style={styles.timerBlock}>
          <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
            <Brain clockLabel={timeShown} size={220} />
          </Animated.View>
          <Text style={styles.timeText}>{timeShown}</Text>
          <Text style={styles.phaseText}>
            {phase === PHASE.FOCUS ? "focus" : "break"}
          </Text>
        </View>

        {/* controls */}
        <View style={styles.controls}>
          <Pressable style={styles.btnSecondary} onPress={() => reset()}>
            <Text style={styles.btnSecondaryText}>reset</Text>
          </Pressable>

          <Pressable
            style={styles.btnPrimary}
            onPress={handleTimerStartPausePress}
          >
            <Text style={styles.btnPrimaryText}>
              {isTimerRunning ? "pause" : "start"}
            </Text>
          </Pressable>

          {isTimerRunning && (
            <Pressable style={styles.btnSecondary} onPress={() => skip()}>
              <Text style={styles.btnSecondaryText}>skip</Text>
            </Pressable>
          )}
        </View>

        {/* presets */}
        <View style={styles.presetsBlock}>
          <Text style={styles.presetsTitle}>presets</Text>
          <View style={styles.presets}>
            {PRESETS.map((p) => (
              <Pressable
                key={p.label}
                style={[
                  styles.chip,
                  p.label === preset.label && styles.chipActive,
                ]}
                onPress={() => selectPreset(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    p.label === preset.label && styles.chipTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.pinkLight,
    alignItems: "center",
    justifyContent: "center",
  },
  safe: {
    flex: 1,
    backgroundColor: theme.colors.pinkLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // header
  header: {
    alignItems: "center",
    gap: 4,
  },
  appTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.pinkDeep,
    letterSpacing: 1,
  },
  presetLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textLight,
  },

  // timer
  timerBlock: {
    alignItems: "center",
  },
  timeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 80,
    color: theme.colors.textDark,
    letterSpacing: 4,
  },
  phaseText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textMid,
    letterSpacing: 3,
    textTransform: "uppercase",
  },

  // controls
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: theme.colors.pinkStrong,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 50,
    ...theme.shadow,
  },
  btnPrimaryText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: 1,
  },
  btnSecondary: {
    backgroundColor: theme.colors.pinkMid,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 50,
  },
  btnSecondaryText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.textDark,
    fontSize: 14,
  },

  // presets
  presetsBlock: {
    alignItems: "center",
    gap: 10,
  },
  presetsTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textLight,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  presets: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.pinkMid,
    borderWidth: 1.5,
    borderColor: theme.colors.pinkMid,
  },
  chipActive: {
    backgroundColor: theme.colors.pinkLight,
    borderColor: theme.colors.pinkStrong,
  },
  chipText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textDark,
  },
  chipTextActive: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.pinkDeep,
  },
});
