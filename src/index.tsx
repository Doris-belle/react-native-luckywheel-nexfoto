import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

export interface WheelComponentProps {
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

const Wheel: React.FC<WheelComponentProps> = ({
  segments,
  segColors,
  textColors,
  onFinished,
  strokeColor = 'black',
  primaryColor = 'white',
  buttonText = 'Spin the Wheel',
  size = 250,
  upDuration = 100,
  downDuration = 1000,
  outlineWidth = 3,
  buttonStyle,
  buttonTextStyles,
  pinImage,
}: WheelComponentProps) => {
  const svgRef = useRef<Svg>(null);
  let timerHandle: number | NodeJS.Timeout = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let maxSpeed = Math.PI / segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;

  const spin = () => {
    if (timerHandle === 0) {
      angleCurrent = Math.random() * Math.PI * 2;
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / segments.length;
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  };

  const onTimerTick = () => {
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      clearInterval(timerHandle);
      timerHandle = 0;
      const rotationAdjustment = (angleCurrent + Math.PI / 2) % (Math.PI * 2);
      const segmentIndex = Math.floor(
        (rotationAdjustment / (Math.PI * 2)) * segments.length
      );
      const winningSegmentIndex =
        (segments.length - segmentIndex - 1) % segments.length;
      const winningSegment = segments[winningSegmentIndex];
      onFinished(winningSegment);
    }
    draw();
  };

  const draw = () => {
    svgRef.current?.setNativeProps({
      style: { transform: [{ rotate: `${angleCurrent}rad` }] },
    });
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={pinImage}
        resizeMode="contain"
        style={{ height: 50, width: 50 }}
      />
      <Svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`-${outlineWidth / 2} -${outlineWidth / 2} ${size + outlineWidth} ${size + outlineWidth}`}
      >
        {segments.map((_, index) => {
          const startAngle = (2 * Math.PI * index) / segments.length;
          const endAngle = (2 * Math.PI * (index + 1)) / segments.length;
          const arcPath = `M ${size / 2} ${size / 2} L ${size / 2 + (size / 2) * Math.cos(startAngle)} ${size / 2 + (size / 2) * Math.sin(startAngle)} A ${size / 2} ${size / 2} 0 0 1 ${size / 2 + (size / 2) * Math.cos(endAngle)} ${size / 2 + (size / 2) * Math.sin(endAngle)} Z`;
          return (
            <Path
              key={index}
              d={arcPath}
              fill={segColors[index % segColors.length]}
              stroke={strokeColor}
              strokeWidth={outlineWidth}
            />
          );
        })}
        {segments.map((segment, index) => {
          const startAngle = (2 * Math.PI * index) / segments.length;
          const endAngle = (2 * Math.PI * (index + 1)) / segments.length;
          const segmentAngle = startAngle + (endAngle - startAngle) / 2;
          const radius = size / 2 - 40; // Adjust the radius as needed
          const x = size / 2 + radius * Math.cos(segmentAngle);
          const y = size / 2 + radius * Math.sin(segmentAngle);
          return (
            <SvgText
              key={index}
              x={x}
              y={y}
              fill={textColors[index % textColors.length]}
              textAnchor="middle"
              fontFamily="Arial"
              fontSize="12"
              transform={`rotate(${segmentAngle * (180 / Math.PI)},${x},${y})`}
            >
              {segment.text}
            </SvgText>
          );
        })}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={5}
          fill={primaryColor}
          stroke={strokeColor}
          strokeWidth={outlineWidth}
        />
      </Svg>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={spin}>
        <Text style={[styles.buttonText, buttonTextStyles]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 10,
    marginTop: 100,
  },
  buttonText: {
    color: 'white',
  },
});

export default Wheel;
