import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
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
  targetSegmentIndex?: number; // 控制最终停止的扇形索引 (从1开始)
}

// 定义暴露给ref的方法接口
export interface WheelRefMethods {
  spin: () => void;
}

// 创建可动画的SVG组件
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Wheel = forwardRef<WheelRefMethods, WheelComponentProps>((props, ref) => {
  const {
    segments,
    segColors,
    textColors,
    onFinished,
    strokeColor = 'black',
    primaryColor = 'white',
    fontFamily = 'Arial',
    buttonText = 'Spin the Wheel',
    size = 268,
    outlineWidth = 3,
    buttonStyle,
    buttonTextStyles,
    pinImage,
    backgroundImage,
    gradientColor = '#FFE170',
    showGradient = true,
    targetSegmentIndex,
  } = props;

  // 使用Animated.Value来控制旋转
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const isSpinning = useRef(false);

  // 计算每个扇区的角度（弧度）
  const segmentAngle = (2 * Math.PI) / segments.length;

  const spin = () => {
    // 防止重复点击
    if (isSpinning.current) {
      return;
    }

    isSpinning.current = true;
    let finalRotationAngle = 0;

    if (
      targetSegmentIndex !== undefined &&
      targetSegmentIndex >= 1 && // 修正：索引从1开始，所以检查 >= 1
      targetSegmentIndex <= segments.length // 修正：检查 <= length
    ) {
      // --- 核心修正：将从1开始的索引转换为从0开始 ---
      const zeroBasedIndex = targetSegmentIndex - 1;

      // 计算目标扇区中心点对准12点钟位置所需的旋转角度
      // 目标扇形i的中心位置 = (i + 0.5) * segmentAngle
      // 要让这个位置对准12点钟（-π/2或3π/2），需要旋转的角度 = 3π/2 - (i + 0.5) * segmentAngle
      finalRotationAngle =
        (1.5 * Math.PI - (zeroBasedIndex + 0.5) * segmentAngle) % (2 * Math.PI);
    } else {
      // 如果没有指定目标扇区，则随机一个最终角度
      finalRotationAngle = Math.random() * Math.PI * 2;
    }

    // 为了让转盘看起来转了好多圈，我们在最终角度上增加若干个 2π
    const spins = 8; // 修改：增加旋转圈数，从5改为8
    const toValue = spins * 2 * Math.PI + finalRotationAngle;

    // 重置动画值到0，并开始动画
    rotationAnim.setValue(0);
    Animated.timing(rotationAnim, {
      toValue: toValue,
      duration: 2000, // 修改：减少动画时长，从4000ms改为2000ms
      useNativeDriver: true,
    }).start(() => {
      // 动画结束后的回调
      let winningSegment;
      if (targetSegmentIndex !== undefined) {
        // --- 修正：同样转换索引来获取结果 ---
        const zeroBasedIndex = targetSegmentIndex - 1;
        winningSegment = segments[zeroBasedIndex];
      } else {
        // 如果是随机旋转，我们需要根据最终停止的角度来计算是哪个扇区
        const pointerAngle = 1.5 * Math.PI; // 12点钟位置的角度
        const normalizedFinalAngle = finalRotationAngle % (2 * Math.PI);

        // 计算指针指向的扇区索引
        const segmentIndex = Math.floor(
          ((2 * Math.PI - normalizedFinalAngle + pointerAngle) %
            (2 * Math.PI)) /
            segmentAngle
        );
        winningSegment = segments[segmentIndex];
      }

      // 动画结束后，将值重置为最终停止的角度，以便下次旋转
      rotationAnim.setValue(finalRotationAngle);
      isSpinning.current = false;
      onFinished(winningSegment);
    });
  };

  // 使用useImperativeHandle暴露方法给父组件
  useImperativeHandle(ref, () => ({
    spin,
  }));

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
              left: -32.5,
              top: -32.5 + 11,
              zIndex: -1,
            }}
          />
        )}

        <AnimatedSvg
          width={size}
          height={size}
          viewBox={`-${outlineWidth / 2} -${outlineWidth / 2} ${size + outlineWidth} ${size + outlineWidth}`}
          style={{
            transform: [
              {
                rotate: rotationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0rad', '1rad'],
                }),
              },
            ],
          }}
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
            // eslint-disable-next-line @typescript-eslint/no-shadow
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
                    fontFamily={fontFamily}
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
        </AnimatedSvg>

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
