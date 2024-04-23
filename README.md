# react-native-spin-the-wheel

## React Native Wheel Component

The React Native Wheel Component is a customizable spinning wheel component for React Native applications. It allows users to spin a wheel with customizable segments and provides callbacks for handling the result of the spin.

## Installation

```sh
npm install react-native-spin-the-wheel
```

## Usage

```js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Wheel, { WheelComponentProps } from 'react-native-wheel-component';

const MyComponent: React.FC = () => {
  const [result, setResult] = useState('');

  const segments = [
    { text: 'Segment 1' },
    { text: 'Segment 2' },
    // Add more segments as needed
  ];

  const onFinished = (segment: any) => {
    setResult(segment);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Wheel
        segments={segments}
        segColors={['red', 'green']} // Example segment colors
        textColors={['black', 'white']} // Example text colors
        onFinished={onFinished}
        pinImage={require('./path/to/pinImage.png')} // Example pin image
        // Add more props as needed
      />
      <Text>Result: {result}</Text>
    </View>
  );
};

export default MyComponent;

```

## Props

```js
interface WheelComponentProps {
    segments: { text: string }[];
    segColors: string[];
    textColors: string[];
    onFinished: (segment: any) => void;
    primaryColor?: string;
    contrastColor?: string;
    buttonText?: string;
    size?: number;
    upDuration?: number;
    downDuration?: number;
    fontFamily?: string;
    fontSize?: string;
    strokeColor?: string;
    outlineWidth?: number;
    buttonStyle?: any;
    buttonTextStyles?: any;
    pinImage: any;
}
```

## Screenshots

![1000025123](https://github.com/shrutigxuriti/react-native-spin-the-wheel/assets/131851981/9ef0b235-43f4-467a-a3f9-304be8df5e8f)

https://github.com/shrutigxuriti/react-native-spin-the-wheel/assets/131851981/5a0570a0-6344-4c6b-ac07-591c539c1f5d




## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
