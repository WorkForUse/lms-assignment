import { router } from "expo-router";
import { useEffect } from "react";
import { validateToken } from "../services/api";

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await validateToken();
        if (isValid) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    };

    // Add a small delay to ensure Root Layout is mounted before navigation
    setTimeout(checkAuth, 100);
  }, []);

  return null;
}
