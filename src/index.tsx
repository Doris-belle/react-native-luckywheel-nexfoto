import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Text as SvgText,
  G,
  Image as SvgImage,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';

export interface WheelComponentProps {
  segments: { text: string; icon?: any; textColor?: string }[];
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
  backgroundImage?: any;
  gradientColor?: string;
  showGradient?: boolean;
  targetSegmentIndex?: number; // 控制最终停止的扇形索引
}

// 定义暴露给ref的方法接口
export interface WheelRefMethods {
  spin: () => void;
}

const Wheel = forwardRef<WheelRefMethods, WheelComponentProps>((props, ref) => {
  const {
    segments,
    segColors,
    textColors,
    onFinished,
    strokeColor = 'black',
    primaryColor = 'white',
    buttonText = 'Spin the Wheel',
    size = 268,
    upDuration = 100,
    downDuration = 1000,
    outlineWidth = 3,
    buttonStyle,
    buttonTextStyles,
    pinImage,
    backgroundImage,
    gradientColor = '#FFE170',
    showGradient = true,
    targetSegmentIndex,
  } = props;

  const svgRef = useRef<any>(null);
  const timerHandleRef = useRef<number | NodeJS.Timeout>(0);
  const angleCurrentRef = useRef<number>(0);
  const angleDeltaRef = useRef<number>(0);
  const maxSpeedRef = useRef<number>(Math.PI / segments.length);
  const spinStartRef = useRef<number>(0);

  const timerDelay = segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;

  const spin = () => {
    if (timerHandleRef.current === 0) {
      if (
        targetSegmentIndex !== undefined &&
        targetSegmentIndex >= 0 &&
        targetSegmentIndex <= segments.length
      ) {
        console.log('****', targetSegmentIndex);
        const targetAngle =
          (2 * Math.PI * targetSegmentIndex) / segments.length;
        const adjustedAngle =
          2 * Math.PI - targetAngle - Math.PI / segments.length;
        angleCurrentRef.current =
          adjustedAngle +
          (Math.random() * 0.2 - 0.1) * (Math.PI / segments.length);
      } else {
        angleCurrentRef.current = Math.random() * Math.PI * 2;
      }
      spinStartRef.current = new Date().getTime();
      maxSpeedRef.current = Math.PI / segments.length;
      timerHandleRef.current = setInterval(onTimerTick, timerDelay);
    }
  };

  // 使用useImperativeHandle暴露方法给父组件
  useImperativeHandle(ref, () => ({
    spin,
  }));

  const onTimerTick = () => {
    const duration = new Date().getTime() - spinStartRef.current;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDeltaRef.current =
        maxSpeedRef.current * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime;
      angleDeltaRef.current =
        maxSpeedRef.current * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrentRef.current += angleDeltaRef.current;
    while (angleCurrentRef.current >= Math.PI * 2)
      angleCurrentRef.current -= Math.PI * 2;
    if (finished) {
      clearInterval(timerHandleRef.current);
      timerHandleRef.current = 0;
      const rotationAdjustment =
        (angleCurrentRef.current + Math.PI / 2) % (Math.PI * 2);
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
      style: { transform: [{ rotate: `${angleCurrentRef.current}rad` }] },
    });
  };

  return (
    <View style={styles.wheelContainer}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {backgroundImage && (
          <Image
            source={backgroundImage}
            resizeMode="contain"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              position: 'absolute',
              width: size + 65,
              height: size + 65,
              left: -32.5, // (size + 65 - size) / 2 = 32.5
              top: -32.5 + 11, // (size + 65 - size) / 2 = 32.5
              zIndex: -1,
            }}
          />
        )}
        <Svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`-${outlineWidth / 2} -${outlineWidth / 2} ${size + outlineWidth} ${size + outlineWidth}`}
        >
          {showGradient && (
            <Defs>
              <RadialGradient id="innerGradient" cx="50%" cy="50%" r="50%">
                <Stop offset="87%" stopColor={gradientColor} stopOpacity="0" />
                <Stop
                  offset="93%"
                  stopColor={gradientColor}
                  stopOpacity="0.3"
                />
                <Stop
                  offset="100%"
                  stopColor={gradientColor}
                  stopOpacity="0.7"
                />
              </RadialGradient>
            </Defs>
          )}
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
          {/* 内部渐变覆盖层 - 放在扇形之后 */}
          {showGradient && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2}
              fill="url(#innerGradient)"
            />
          )}
          {segments.map((segment, index) => {
            const startAngle = (2 * Math.PI * index) / segments.length;
            const endAngle = (2 * Math.PI * (index + 1)) / segments.length;
            const segmentAngle = startAngle + (endAngle - startAngle) / 2;

            // Text position - moved higher up
            const textRadius = size / 2 - 35;
            const textX = size / 2 + textRadius * Math.cos(segmentAngle);
            const textY = size / 2 + textRadius * Math.sin(segmentAngle);

            // Icon position - below text
            const iconRadius = size / 2 - 70;
            const iconX = size / 2 + iconRadius * Math.cos(segmentAngle);
            const iconY = size / 2 + iconRadius * Math.sin(segmentAngle);

            // Calculate rotation to make text horizontal (perpendicular to radius)
            const textRotation = segmentAngle * (180 / Math.PI) + 90;

            // Automatic word-wrapping: compute max usable width along the arc at the text radius,
            // estimate text width from font size, and split into lines that fit.
            const fontSizePx = 12; // keep in sync with SvgText fontSize below
            const arcAngle = (2 * Math.PI) / segments.length;
            const maxArcWidth = textRadius * arcAngle; // approximate chord length along tangent
            const horizontalPadding = 10; // leave some margin from segment edges
            const maxLineWidth = Math.max(30, maxArcWidth - horizontalPadding);

            const estimateTextWidth = (t: string) =>
              t.length * fontSizePx * 0.6; // rough estimate

            const splitTextAuto = (text: string) => {
              const words = text.split(/\s+/).filter(Boolean);
              const lines: string[] = [];
              let current = '';

              const pushCurrent = () => {
                if (current.trim().length > 0) lines.push(current.trim());
                current = '';
              };

              const hardWrapWord = (word: string) => {
                const maxChars = Math.max(
                  1,
                  Math.floor(maxLineWidth / (fontSizePx * 0.6))
                );
                for (let i = 0; i < word.length; i += maxChars) {
                  const slice = word.slice(i, i + maxChars);
                  if (
                    estimateTextWidth((current + ' ' + slice).trim()) >
                    maxLineWidth
                  ) {
                    pushCurrent();
                    current = slice;
                  } else {
                    current = (current + ' ' + slice).trim();
                  }
                }
              };

              for (const word of words) {
                if (
                  estimateTextWidth((current + ' ' + word).trim()) <=
                  maxLineWidth
                ) {
                  current = (current + ' ' + word).trim();
                } else if (estimateTextWidth(word) > maxLineWidth) {
                  // word itself too long, hard-wrap inside the word
                  hardWrapWord(word);
                } else {
                  pushCurrent();
                  current = word;
                }
              }
              pushCurrent();
              return lines.length > 0 ? lines : [text];
            };

            const textLines = splitTextAuto(segment.text);
            const lineHeight = 14; // Adjust line spacing

            return (
              <G key={index}>
                {textLines.map((line, lineIndex) => (
                  <SvgText
                    key={lineIndex}
                    x={textX}
                    y={
                      textY -
                      ((textLines.length - 1) * lineHeight) / 2 +
                      lineIndex * lineHeight
                    }
                    fill={
                      segment.textColor || textColors[index % textColors.length]
                    }
                    textAnchor="middle"
                    fontFamily="Arial"
                    fontSize="12"
                    transform={`rotate(${textRotation},${textX},${textY})`}
                  >
                    {line}
                  </SvgText>
                ))}
                {segment.icon && (
                  <SvgImage
                    x={iconX - 15}
                    y={iconY - 15}
                    width={30}
                    height={30}
                    href={segment.icon}
                    transform={`rotate(${textRotation},${iconX},${iconY})`}
                  />
                )}
              </G>
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
        <Image
          source={pinImage}
          resizeMode="contain"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute',
            height: 62,
            width: 48,
            left: size / 2 - 24,
            top: size / 2 - 32,
          }}
        />
      </View>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={spin}>
        <Text style={[styles.buttonText, buttonTextStyles]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  wheelContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
    marginTop: 35,
  },
  buttonText: {
    color: 'white',
  },
});

export default Wheel;
