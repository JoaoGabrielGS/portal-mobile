import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  Reactotron.configure({
    name: 'Portal Mobile EAD',
  })
    .useReactNative()
    .connect();

  console.tron = Reactotron;
}
