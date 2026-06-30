import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import Head from "expo-router/head";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter': require('../../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Deaf Pathway Training</title>
        <meta name="description" content="Bible story training app for Deaf Pathway Global — explore Jesus, Church, and Mission foundation stories." />
        <html lang="en" />
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}