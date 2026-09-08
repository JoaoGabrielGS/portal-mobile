import Constants, { ExecutionEnvironment } from 'expo-constants';

const ONESIGNAL_APP_ID = 'cd370a90-83fd-4158-aa2a-d12fc1e1f08d';

export const initPush = (cdUsuario: string) => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    if (__DEV__) {
      console.warn('[push] OneSignal indisponível no Expo Go: precisa de dev client/build nativo.');
    }
    return;
  }

  try {
    const { LogLevel, OneSignal } = require('react-native-onesignal');

    if (__DEV__) {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    }
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.login(cdUsuario);
    OneSignal.Notifications.requestPermission(false);
  } catch (error) {
    if (__DEV__) {
      console.warn('[push] OneSignal indisponível (precisa de dev client/build nativo):', error);
    }
  }
};
