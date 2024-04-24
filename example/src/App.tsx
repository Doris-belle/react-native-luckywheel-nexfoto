import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import Wheel from 'react-native-spin-the-wheel';

export default function App() {
  const [winnerName, setWinnerName] = React.useState('');
  const segments = [
    { text: 'Grey', textColour: 'white', backgroundColour: '#5861D0' },
    { text: 'Green', textColour: 'white', backgroundColour: '#3B3CAD' },
    { text: 'Red', textColour: 'white', backgroundColour: '#5861D0' },
    { text: 'Blue', textColour: 'white', backgroundColour: '#3B3CAD' },
    { text: 'Orange', textColour: 'white', backgroundColour: '#5861D0' },
    { text: 'Black', textColour: 'white', backgroundColour: '#3B3CAD' },
  ];

  const finishedSpinning = (segment: string) => {
    console.log('Winner', segment);
    setWinnerName(segment);
  };
  return (
    <View style={styles.container}>
      <Wheel
        segments={segments}
        segColors={segments.map((segment) => segment.backgroundColour)}
        onFinished={(segment: any) => finishedSpinning(segment.text)}
        primaryColor={'#5861D0'}
        textColors={segments.map((segment) => segment.textColour)}
        buttonText="Spin the Wheel"
        pinImage={require('../assets/pin.png')}
        outlineWidth={1}
        buttonStyle={{
          backgroundColor: '#527800',
        }}
      />
      {winnerName !== '' && (
        <Text style={{ marginTop: 30 }}>Winner: {winnerName}</Text>
      )}
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
