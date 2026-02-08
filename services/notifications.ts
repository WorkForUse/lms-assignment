import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

/**
 * ✅ FIXED: trigger type issue solved
 */
export const scheduleBookmarkReminder = async (
  courseTitle: string,
  courseId: string,
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Course Reminder",
        body: `Don't forget to check out "${courseTitle}"!`,
        data: { courseId },
      },
      trigger: {
        seconds: 24 * 60 * 60,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput, // 👈 IMPORTANT
    });
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
