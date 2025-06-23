import React from 'react';
import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SGView({
  horizontalPaddings,
  children,
  style,
  safeArea,
  flex,
  border,
  horizontal,
  insetBottom,
  themedBackground,
  pressable,
  ...props
}: {
  safeArea?: boolean;
  horizontalPaddings?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  flex?: number;
  border?: boolean;
  horizontal?: boolean;
  insetBottom?: boolean;
  themedBackground?: boolean;
  pressable?: boolean;
} & View["props"]) {
  const { top, bottom } = useSafeAreaInsets();
  
  return (
    <View
      style={[
        {
          paddingHorizontal: horizontalPaddings ? 16 : undefined,
          paddingTop: safeArea ? top : undefined,
          paddingBottom: insetBottom ? bottom : undefined,
          flex,
          borderWidth: border ? 1 : undefined,
          borderColor: border ? '#ddd' : undefined,
          flexDirection: horizontal ? "row" : "column",
          // backgroundColor: themedBackground ? theme.background : undefined,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}