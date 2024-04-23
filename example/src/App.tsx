import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import Wheel from 'react-native-spin-the-wheel';

export default function App() {
  const segments = [
    { text: 'Grey', textColour: 'red', backgroundColour: 'white' },
    { text: 'Green', textColour: 'white', backgroundColour: 'red' },
    { text: 'Red', textColour: 'red', backgroundColour: 'white' },
    { text: 'Blue', textColour: 'white', backgroundColour: 'red' },
    { text: 'Orange', textColour: 'red', backgroundColour: 'white' },
    { text: 'Black', textColour: 'white', backgroundColour: 'red' },
  ];

  const finishedSpinning = (segment: string) => {
    console.log('Winner', segment);
  };
  return (
    <View style={styles.container}>
      <Wheel
        segments={segments}
        segColors={segments.map((segment) => segment.backgroundColour)}
        onFinished={(segment: any) => finishedSpinning(segment.text)}
        primaryColor={'white'}
        textColors={segments.map((segment) => segment.textColour)}
        buttonText="Spin the Wheel"
        pinImage={require('../assets/pin.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
