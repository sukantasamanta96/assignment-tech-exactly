import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
  ViewStyle,
  ImageStyle,
  PanResponder,
  LayoutChangeEvent,
  Animated,
  Dimensions,
} from "react-native";

interface CustomCarouselProps {
  data: string[];
  height: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showPagination?: boolean;
}

interface PaginationDotProps {
  isActive: boolean;
  onPress: () => void;
  animatedValue: Animated.Value;
}

const { width: screenWidth } = Dimensions.get("window");

const CustomImageCarousel: React.FC<CustomCarouselProps> = ({
  data,
  height,
  autoPlay = false,
  autoPlayInterval = 3000,
  showPagination = true,
}) => {
  const flatListRef = useRef<FlatList<string>>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(screenWidth);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Animated values for smoother transitions
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Handle container layout
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (width > 0 && Math.abs(width - containerWidth) > 1) {
        setContainerWidth(width);
      }
    },
    [containerWidth],
  );

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || data.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex >= data.length - 1 ? 0 : prevIndex + 1;

          if (flatListRef.current && containerWidth > 0) {
            flatListRef.current.scrollToIndex({
              index: newIndex,
              animated: true,
            });
          }

          return newIndex;
        });
      }
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, data.length, isDragging, containerWidth]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  // Enhanced pan responder with better gesture recognition
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,

        onMoveShouldSetPanResponder: (evt, gestureState) => {
          const isHorizontal =
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          const hasMinDistance = Math.abs(gestureState.dx) > 8;
          return isHorizontal && hasMinDistance;
        },

        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
          return Math.abs(gestureState.dx) > 10;
        },

        onPanResponderGrant: () => {
          setIsDragging(true);
          stopAutoPlay();

          // Disable FlatList native scrolling
          if (flatListRef.current) {
            flatListRef.current.setNativeProps({ scrollEnabled: false });
          }
        },

        onPanResponderMove: (evt, gestureState) => {
          // Prevent parent scroll interference
          if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
            evt.preventDefault?.();
          }
        },

        onPanResponderRelease: (evt, gestureState) => {
          setIsDragging(false);

          // Re-enable FlatList scrolling
          if (flatListRef.current) {
            flatListRef.current.setNativeProps({ scrollEnabled: true });
          }

          const { dx, vx } = gestureState;
          const swipeThreshold = containerWidth * 0.25; // 25% of container width
          const velocityThreshold = 0.5;

          let newIndex = currentIndex;

          // Determine swipe direction with better thresholds
          if (dx > swipeThreshold || vx > velocityThreshold) {
            newIndex = Math.max(0, currentIndex - 1);
          } else if (dx < -swipeThreshold || vx < -velocityThreshold) {
            newIndex = Math.min(data.length - 1, currentIndex + 1);
          }

          // Animate to new position
          if (newIndex !== currentIndex && containerWidth > 0) {
            // Fade animation for smoother transition
            Animated.sequence([
              Animated.timing(fadeAnim, {
                toValue: 0.7,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start();

            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToIndex({
              index: newIndex,
              animated: true,
            });
          }

          // Restart auto-play after interaction
          if (autoPlay) {
            setTimeout(startAutoPlay, 100);
          }
        },

        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
      }),
    [
      currentIndex,
      data.length,
      containerWidth,
      autoPlay,
      startAutoPlay,
      stopAutoPlay,
      fadeAnim,
    ],
  );

  // Optimized scroll handler with debouncing
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (containerWidth === 0) return;

      const offsetX = event.nativeEvent.contentOffset.x;

      // Update animated value for pagination dots
      scrollX.setValue(offsetX);

      // Debounce index calculation
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const newIndex = Math.round(offsetX / containerWidth);

        if (
          newIndex !== currentIndex &&
          newIndex >= 0 &&
          newIndex < data.length
        ) {
          setCurrentIndex(newIndex);
        }
      }, 50);
    },
    [containerWidth, currentIndex, data.length, scrollX],
  );

  // Enhanced pagination press with animation
  const onPressPagination = useCallback(
    (index: number) => {
      if (
        index === currentIndex ||
        !flatListRef.current ||
        containerWidth === 0
      ) {
        return;
      }

      stopAutoPlay();

      // Smooth fade transition
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      });

      setCurrentIndex(index);
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });

      // Restart auto-play
      if (autoPlay) {
        setTimeout(startAutoPlay, 100);
      }
    },
    [
      currentIndex,
      containerWidth,
      autoPlay,
      startAutoPlay,
      stopAutoPlay,
      fadeAnim,
    ],
  );

  // Memoized and optimized item renderer
  const renderItem: ListRenderItem<string> = useCallback(
    ({ item, index }) => {
      const itemStyle: ViewStyle = {
        width: containerWidth,
        height,
        justifyContent: "center",
        alignItems: "center",
      };

      const imageStyle: ImageStyle = {
        width: "100%",
        height: "100%",
      };

      return (
        <Animated.View style={[itemStyle, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: item }}
            style={imageStyle}
            resizeMode="cover"
            fadeDuration={Platform.OS === "ios" ? 200 : 0}
            loadingIndicatorSource={undefined}
            // Performance optimizations
            {...(Platform.OS === "android" && {
              progressiveRenderingEnabled: true,
              borderRadius: 0, // Avoid clipping on Android
            })}
          // Preload adjacent images
          />
        </Animated.View>
      );
    },
    [containerWidth, height, fadeAnim],
  );

  // Enhanced pagination dot with smooth animations
  const PaginationDot: React.FC<PaginationDotProps> = React.memo(
    ({ isActive, onPress, animatedValue }) => {
      const animatedScale = useRef(
        new Animated.Value(isActive ? 1 : 0.8),
      ).current;
      const animatedOpacity = useRef(
        new Animated.Value(isActive ? 1 : 0.6),
      ).current;

      useEffect(() => {
        Animated.parallel([
          Animated.spring(animatedScale, {
            toValue: isActive ? 1.2 : 0.8,
            useNativeDriver: true,
            tension: 300,
            friction: 8,
          }),
          Animated.timing(animatedOpacity, {
            toValue: isActive ? 1 : 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, [isActive, animatedScale, animatedOpacity]);

      const dotStyle: ViewStyle = {
        width: 8,
        height: 8,
        borderRadius: 5,
        marginHorizontal: 3,
        backgroundColor: "white",
      };

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={{ padding: 3 }}
        >
          <Animated.View
            style={[
              dotStyle,
              {
                transform: [{ scale: animatedScale }],
                opacity: animatedOpacity,
              },
            ]}
          />
        </TouchableOpacity>
      );
    },
  );

  PaginationDot.displayName = "PaginationDot";

  // Optimized pagination rendering
  const renderPagination = useMemo(() => {
    if (!showPagination || data.length <= 1) return null;

    return data.map((_, index) => (
      <PaginationDot
        key={`dot-${index}`}
        isActive={index === currentIndex}
        onPress={() => onPressPagination(index)}
        animatedValue={scrollX}
      />
    ));
  }, [
    data,
    currentIndex,
    onPressPagination,
    scrollX,
    showPagination,
    PaginationDot,
  ]);

  // Performance optimizations
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth],
  );

  const keyExtractor = useCallback(
    (item: string, index: number) => `carousel-${index}-${item.slice(-10)}`,
    [],
  );

  const handleScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      setTimeout(() => {
        if (flatListRef.current && containerWidth > 0) {
          flatListRef.current.scrollToIndex({
            index: Math.min(info.index, data.length - 1),
            animated: true,
          });
        }
      }, 100);
    },
    [containerWidth, data.length],
  );

  // Memoized styles
  const containerStyle: ViewStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: "#000",
      overflow: "hidden",
    }),
    [],
  );

  const paginationContainerStyle: ViewStyle = useMemo(
    () => ({
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      pointerEvents: "box-none",
    }),
    [],
  );

  const paginationWrapperStyle: ViewStyle = useMemo(
    () => ({
      flexDirection: "row",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      alignItems: "center",
      pointerEvents: "auto",
      backdropFilter: "blur(10px)", // iOS blur effect
    }),
    [],
  );

  // Early returns after all hooks
  if (!data || data.length === 0 || height <= 0) {
    return null;
  }

  // Single image optimization
  if (data.length === 1) {
    return (
      <View style={containerStyle} onLayout={onLayout}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={{ uri: data[0] }}
            style={{ width: "100%", height }}
            resizeMode="cover"
            fadeDuration={200}
          />
        </Animated.View>
      </View>
    );
  }

  // Loading state
  if (containerWidth === 0) {
    return <View style={[containerStyle, { height }]} onLayout={onLayout} />;
  }

  return (
    <View style={containerStyle} onLayout={onLayout}>
      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={(evt) => false}
        onResponderTerminationRequest={() => false}
      >
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
              listener: handleScroll,
            },
          )}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={false}
          overScrollMode="never"
          // Performance optimizations
          removeClippedSubviews={Platform.OS === "android"}
          maxToRenderPerBatch={2}
          initialNumToRender={1}
          windowSize={3}
          getItemLayout={getItemLayout}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 80,
            minimumViewTime: 100,
          }}
          snapToInterval={containerWidth}
          snapToAlignment="center"
          legacyImplementation={false}
          updateCellsBatchingPeriod={50}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          // Gesture handling
          scrollEnabled={!isDragging}
          nestedScrollEnabled={false}
          // Animation improvements
          onMomentumScrollBegin={() => setIsDragging(true)}
          onMomentumScrollEnd={() => {
            setIsDragging(false);
            if (autoPlay) {
              setTimeout(startAutoPlay, 200);
            }
          }}
        />
      </View>

      {/* Enhanced Pagination */}
      {showPagination && data.length > 1 && (
        <View style={paginationContainerStyle}>
          <View style={paginationWrapperStyle}>{renderPagination}</View>
        </View>
      )}
    </View>
  );
};

export default CustomImageCarousel;


{/**
  Example
  
      const productImages = [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600',
      ];
        
      <CustomImageCarousel
          data={productImages}
          height={200}
      />
      
  */}