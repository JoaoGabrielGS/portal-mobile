import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const ACCENT = '#EF6C00';
const BG = '#121212';
const MUTED = 'rgba(255,255,255,0.38)';

type Props = {
  onFinish: () => void;
};

export function AnimatedSplash({ onFinish }: Props) {
  // logo drop-in
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-28);
  const logoScale = useSharedValue(0.9);

  // ring rotation
  const ringRotate = useSharedValue(0);

  // glow pulse
  const glowOpacity = useSharedValue(0.7);
  const glowScale = useSharedValue(1);

  // decorative rules
  const ruleOpacity = useSharedValue(0);
  const ruleScale = useSharedValue(0.3);

  // divider
  const dividerOpacity = useSharedValue(0);
  const dividerTranslateY = useSharedValue(18);

  // text block
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(18);

  // badge / loader
  const badgeOpacity = useSharedValue(0);
  const badgeTranslateY = useSharedValue(18);
  const loaderWidth = useSharedValue(0);

  // corners
  const cornerOpacity = useSharedValue(0);

  // exit
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withDelay(150, withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) }));
    logoTranslateY.value = withDelay(150, withTiming(0, { duration: 700, easing: Easing.out(Easing.exp) }));
    logoScale.value = withDelay(150, withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) }));

    ringRotate.value = withRepeat(withTiming(360, { duration: 14000, easing: Easing.linear }), -1, false);

    glowOpacity.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
    glowScale.value = withRepeat(withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);

    ruleOpacity.value = withDelay(1200, withTiming(0.55, { duration: 800 }));
    ruleScale.value = withDelay(1200, withTiming(1, { duration: 800 }));

    dividerOpacity.value = withDelay(650, withTiming(1, { duration: 600 }));
    dividerTranslateY.value = withDelay(650, withTiming(0, { duration: 600 }));

    textOpacity.value = withDelay(500, withTiming(1, { duration: 700 }));
    textTranslateY.value = withDelay(500, withTiming(0, { duration: 700 }));

    badgeOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    badgeTranslateY.value = withDelay(1000, withTiming(0, { duration: 600 }));

    loaderWidth.value = withDelay(1100, withTiming(100, { duration: 2200, easing: Easing.out(Easing.cubic) }));

    cornerOpacity.value = withDelay(1400, withTiming(0.6, { duration: 500 }));

    containerOpacity.value = withDelay(
      5500,
      withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }, { scale: logoScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotate.value}deg` }],
  }));

  const glowOuterStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.09,
    transform: [{ scale: glowScale.value }],
  }));

  const glowInnerStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.07,
    transform: [{ scale: glowScale.value }],
  }));

  const ruleStyle = useAnimatedStyle(() => ({
    opacity: ruleOpacity.value,
    transform: [{ scaleX: ruleScale.value }],
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    opacity: dividerOpacity.value,
    transform: [{ translateY: dividerTranslateY.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ translateY: badgeTranslateY.value }],
  }));

  const loaderFillStyle = useAnimatedStyle(() => ({
    width: `${loaderWidth.value}%`,
  }));

  const cornerStyle = useAnimatedStyle(() => ({ opacity: cornerOpacity.value }));

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      {/* Linhas decorativas */}
      <Animated.View style={[styles.rule, styles.ruleTop, ruleStyle]} />
      <Animated.View style={[styles.rule, styles.ruleBottom, ruleStyle]} />

      {/* Cantos decorativos */}
      <Animated.View style={[styles.corner, styles.cTl, cornerStyle]}>
        <View style={styles.cornerH} />
        <View style={styles.cornerV} />
      </Animated.View>
      <Animated.View style={[styles.corner, styles.cTr, cornerStyle]}>
        <View style={styles.cornerH} />
        <View style={styles.cornerV} />
      </Animated.View>
      <Animated.View style={[styles.corner, styles.cBl, cornerStyle]}>
        <View style={styles.cornerH} />
        <View style={styles.cornerV} />
      </Animated.View>
      <Animated.View style={[styles.corner, styles.cBr, cornerStyle]}>
        <View style={styles.cornerH} />
        <View style={styles.cornerV} />
      </Animated.View>

      <View style={styles.content}>
        {/* Logo + anel */}
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Animated.View style={[styles.glowOuter, glowOuterStyle]} />
          <Animated.View style={[styles.glowInner, glowInnerStyle]} />
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Animated.View style={[styles.logoRing, ringStyle]}>
            <View style={styles.ringDot} />
          </Animated.View>
        </Animated.View>

        {/* Divisor */}
        <Animated.View style={[styles.divider, dividerStyle]} />

        {/* Texto */}
        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.eyebrow}>SEJA BEM-VINDO</Text>
          <Text style={styles.headline}>
            Sua jornada{'\n'}começa <Text style={styles.headlineAccent}>agora</Text>.
          </Text>
          <Text style={styles.sub}>
            O aplicativo oficial EAD da{'\n'}
            <Text style={styles.subStrong}>Unifatecie</Text> na palma da sua mão.
          </Text>
        </Animated.View>
      </View>

      {/* Loader */}
      <Animated.View style={[styles.badge, badgeStyle]}>
        <View style={styles.loaderBar}>
          <Animated.View style={[styles.loaderFill, loaderFillStyle]} />
        </View>
        <Text style={styles.badgeText}>CARREGANDO…</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  glowOuter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 220,
    height: 220,
    marginLeft: -110,
    marginTop: -110,
    borderRadius: 110,
    backgroundColor: ACCENT,
  },
  glowInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 150,
    height: 150,
    marginLeft: -75,
    marginTop: -75,
    borderRadius: 75,
    backgroundColor: ACCENT,
  },

  rule: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: ACCENT,
  },
  ruleTop: { top: height * 0.11 },
  ruleBottom: { bottom: height * 0.11 },

  logoWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    tintColor: '#FFFFFF',
  },
  logoRing: {
    position: 'absolute',
    width: 152,
    height: 152,
    borderRadius: 76,
    borderWidth: 1.5,
    borderColor: 'rgba(239,108,0,0.35)',
    alignItems: 'center',
  },
  ringDot: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },

  divider: {
    width: 48,
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 2,
    marginTop: 36,
    marginBottom: 28,
  },

  textBlock: {
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: ACCENT,
    marginBottom: 14,
  },
  headline: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: ACCENT,
  },
  sub: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '300',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  subStrong: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  badge: {
    position: 'absolute',
    bottom: 44,
    alignItems: 'center',
  },
  loaderBar: {
    width: 80,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },
  badgeText: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 2,
    color: MUTED,
  },

  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
  },
  cornerH: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    top: 0,
    left: 0,
    backgroundColor: ACCENT,
  },
  cornerV: {
    position: 'absolute',
    width: 1.5,
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: ACCENT,
  },
  cTl: { top: 28, left: 28 },
  cTr: { top: 28, right: 28, transform: [{ scaleX: -1 }] },
  cBl: { bottom: 28, left: 28, transform: [{ scaleY: -1 }] },
  cBr: { bottom: 28, right: 28, transform: [{ scale: -1 }] },
});
