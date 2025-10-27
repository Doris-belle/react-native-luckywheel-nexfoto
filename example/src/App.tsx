import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import Wheel from 'react-native-luckywheel-nexfoto';

export default function App() {
  const [winnerName, setWinnerName] = React.useState('');
  const segments = [
    {
      text: 'Unlimited Cloud Storage',
      textColour: '#000000',
      backgroundColour: '#FFF',
      icon: require('../assets/cloud-purple.png'),
    },
    {
      text: 'Thank you for participating',
      textColour: '#CE7E27',
      backgroundColour: '#FED2A2',
      icon: require('../assets/cheers.png'),
    },
    {
      text: 'Unlimited Cloud Storage',
      textColour: '#000000',
      backgroundColour: '#FFF',
      icon: require('../assets/cloud-purple.png'),
    },
    {
      text: 'Thank you for participating',
      textColour: '#CE7E27',
      backgroundColour: '#FED2A2',
      icon: require('../assets/cheers.png'),
    },
    {
      text: 'Unlimited Cloud Storage',
      textColour: '#000000',
      backgroundColour: '#FFF',
      icon: require('../assets/cloud-purple.png'),
    },
    {
      text: 'Thank you for participating',
      textColour: '#CE7E27',
      backgroundColour: '#FED2A2',
      icon: require('../assets/cheers.png'),
    },
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
        primaryColor={'#FF6B35'}
        textColors={segments.map((segment) => segment.textColour)}
        buttonText="Immediately Lottery"
        pinImage={require('../assets/pin.png')}
        backgroundImage={require('../assets/out.png')}
        gradientColor="#FFE170"
        showGradient={true}
        outlineWidth={0}
        // eslint-disable-next-line react-native/no-inline-styles
        buttonStyle={{
          backgroundColor: '#FFF8AD',
          borderRadius: 50,
          width: 240,
          height: 48,
        }}
        // eslint-disable-next-line react-native/no-inline-styles
        buttonTextStyles={{
          color: '#000000',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      />
      {winnerName !== '' && (
        // eslint-disable-next-line react-native/no-inline-styles
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
