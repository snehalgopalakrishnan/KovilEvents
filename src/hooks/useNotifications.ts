import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    registerForPushNotifications();
  }, [user]);

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log('Push notifications only work on real devices');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission not granted for notifications');
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'ac6af742-2864-41e4-90ea-455c4190a738',
    });

    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        fcmToken: token.data,
      });
      console.log('Push token saved:', token.data);
    }
  }
}