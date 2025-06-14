import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    StyleSheet,
    ViewStyle,
    TextStyle,
    PanResponder,
} from 'react-native';
import { COLOR } from '../../constants/color_code';

/**
 * Interface for individual tab configuration
 */
interface TabItem {
    /** Unique identifier for the tab */
    key: string;
    /** Display title for the tab */
    title: string;
    /** Content component to render when tab is active */
    content: React.ReactNode;
    /** Whether tab is disabled */
    disabled?: boolean;
}

/**
 * Props interface for CustomTab component
 */
interface CustomTabProps {
    /** Array of tab configurations */
    tabs: TabItem[];
    /** Initially active tab key */
    initialTab?: string;
    /** Callback when tab changes */
    onTabChange?: (tabKey: string, tabIndex: number) => void;
    /** Tab bar background color */
    tabBarBackgroundColor?: string;
    /** Active tab text color */
    activeTextColor?: string;
    /** Inactive tab text color */
    inactiveTextColor?: string;
    /** Active indicator color (white line) */
    activeIndicatorColor?: string;
    /** Tab bar height */
    tabBarHeight?: number;
    /** Whether tabs should be scrollable */
    scrollableTabs?: boolean;
    /** Custom tab bar style */
    tabBarStyle?: ViewStyle;
    /** Custom active text style */
    activeTextStyle?: TextStyle;
    /** Custom inactive text style */
    inactiveTextStyle?: TextStyle;
    /** Animation duration in milliseconds */
    animationDuration?: number;
    /** Animation easing type */
    animationType?: 'timing' | 'spring';
    /** Show slide animation preview during gesture */
    showPreviewAnimation?: boolean;
    /** Tab indicator height */
    indicatorHeight?: number;
    /** Content container style */
    contentContainerStyle?: ViewStyle;
    /** Enable swipe gestures */
    enableSwipeGesture?: boolean;
}

/**
 * CustomTab Component with rotation support
 * 
 */
const CustomTab: React.FC<CustomTabProps> = ({
    tabs,
    initialTab,
    onTabChange,
    tabBarBackgroundColor = COLOR.GREEN.SEA_GREEN,
    activeTextColor = COLOR.WHITE.PURE_WHITE,
    inactiveTextColor = COLOR.GREEN.WHITE_GREEN,
    activeIndicatorColor = COLOR.WHITE.PURE_WHITE,
    tabBarHeight = 50,
    scrollableTabs = false,
    tabBarStyle,
    activeTextStyle,
    inactiveTextStyle,
    animationDuration = 250,
    indicatorHeight = 3,
    contentContainerStyle,
    enableSwipeGesture = true,
}) => {
    // Find initial tab index
    const initialIndex = initialTab
        ? tabs.findIndex(tab => tab.key === initialTab)
        : 0;

    // State for active tab and screen dimensions
    const [activeTabIndex, setActiveTabIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

    // Animation values
    const indicatorPosition = useRef(new Animated.Value(0)).current;
    const contentOffset = useRef(new Animated.Value(0)).current;
    const panValue = useRef(new Animated.Value(0)).current;

    // Tab width calculation based on current screen width
    const tabWidth = scrollableTabs ? 120 : screenDimensions.width / tabs.length;

    /**
     * Handle screen rotation and dimension changes
     */
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
            
            // Recalculate positions based on new dimensions
            const newTabWidth = scrollableTabs ? 120 : window.width / tabs.length;
            
            // Update indicator position without animation to avoid glitches
            indicatorPosition.setValue(activeTabIndex * newTabWidth);
            
            // Update content offset without animation
            contentOffset.setValue(-activeTabIndex * window.width);
            
            // Reset pan value
            panValue.setValue(0);
        });

        return () => subscription?.remove();
    }, [activeTabIndex, scrollableTabs, tabs.length, indicatorPosition, contentOffset, panValue]);

    /**
     * Handles tab press and animations with directional sliding
     */
    const handleTabPress = useCallback((tabIndex: number, tabKey: string) => {
        if (tabs[tabIndex].disabled || tabIndex === activeTabIndex) return;

        setActiveTabIndex(tabIndex);

        // Animate indicator with subtle spring animation
        Animated.spring(indicatorPosition, {
            toValue: tabIndex * tabWidth,
            useNativeDriver: false,
            tension: 80,
            friction: 10,
        }).start();

        // Animate content with smooth, subtle timing
        Animated.timing(contentOffset, {
            toValue: -tabIndex * screenDimensions.width,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();

        // Reset pan value gently
        Animated.timing(panValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
        }).start();

        // Callback
        onTabChange?.(tabKey, tabIndex);
    }, [tabs, tabWidth, animationDuration, indicatorPosition, contentOffset, activeTabIndex, onTabChange, panValue, screenDimensions.width]);

    /**
     * Pan responder for smooth swipe gestures with directional animations
     */
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return enableSwipeGesture && Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 60;
        },
        onPanResponderGrant: () => {
            // Set initial value when gesture starts
            panValue.extractOffset();
            panValue.setValue(0);
        },
        onPanResponderMove: (evt, gestureState) => {
            if (!enableSwipeGesture) return;

            // Real-time pan animation with bounds checking
            const maxOffset = (tabs.length - 1) * screenDimensions.width;
            const currentOffset = activeTabIndex * screenDimensions.width;

            let newValue = gestureState.dx;

            // Prevent over-scrolling at boundaries with gentle resistance
            if (currentOffset <= 0 && gestureState.dx > 0) {
                newValue = gestureState.dx * 0.15; // Very gentle resistance at start
            } else if (currentOffset >= maxOffset && gestureState.dx < 0) {
                newValue = gestureState.dx * 0.15; // Very gentle resistance at end
            }

            panValue.setValue(newValue);
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (!enableSwipeGesture) return;

            panValue.flattenOffset();

            const { dx, vx } = gestureState;
            const threshold = screenDimensions.width * 0.25; // Slightly higher threshold
            const velocityThreshold = 0.4;

            let newIndex = activeTabIndex;

            // Determine new tab based on gesture direction
            if (dx > threshold || vx > velocityThreshold) {
                // Swipe right - previous tab (slide right to left content)
                newIndex = Math.max(0, activeTabIndex - 1);
            } else if (dx < -threshold || vx < -velocityThreshold) {
                // Swipe left - next tab (slide left to right content)
                newIndex = Math.min(tabs.length - 1, activeTabIndex + 1);
            }

            // Gentle spring animation back to position
            Animated.spring(panValue, {
                toValue: 0,
                useNativeDriver: true,
                tension: 60,
                friction: 12,
                velocity: vx * 0.5, // Reduce velocity impact
            }).start();

            // Change tab with smooth sliding animation
            if (newIndex !== activeTabIndex) {
                // Animate to new tab position
                setActiveTabIndex(newIndex);

                // Animate indicator with subtle movement
                Animated.spring(indicatorPosition, {
                    toValue: newIndex * tabWidth,
                    useNativeDriver: false,
                    tension: 70,
                    friction: 12,
                }).start();

                // Animate content with gentle sliding
                Animated.timing(contentOffset, {
                    toValue: -newIndex * screenDimensions.width,
                    duration: animationDuration,
                    useNativeDriver: true,
                }).start();

                // Callback
                onTabChange?.(tabs[newIndex].key, newIndex);
            }
        },
    });

    /**
     * Renders individual tab button
     */
    const renderTab = useCallback((tab: TabItem, index: number) => {
        const isActive = index === activeTabIndex;
        const isDisabled = tab.disabled;

        const tabStyles = [
            styles.tab,
            { width: tabWidth },
            isDisabled && styles.disabledTab,
        ];

        const textStyles = [
            styles.tabText,
            {
                color: isActive ? activeTextColor : inactiveTextColor,
                // fontWeight: isActive ? '600' : '400',
            },
            isActive ? activeTextStyle : inactiveTextStyle,
            isDisabled && styles.disabledText,
        ];

        return (
            <TouchableOpacity
                key={tab.key}
                style={tabStyles}
                onPress={() => handleTabPress(index, tab.key)}
                disabled={isDisabled}
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel={`${tab.title} tab`}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
            >
                <View style={styles.tabContent}>
                    {/* Title */}
                    <Text style={textStyles} numberOfLines={1}>
                        {tab.title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }, [
        activeTabIndex,
        tabWidth,
        activeTextColor,
        inactiveTextColor,
        activeTextStyle,
        inactiveTextStyle,
        activeIndicatorColor,
        handleTabPress
    ]);

    /**
     * Renders tab content with swipe animation
     */
    const renderContent = useCallback(() => {
        const combinedTranslateX = Animated.add(contentOffset, panValue);

        return (
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        width: screenDimensions.width * tabs.length,
                        transform: [{ translateX: combinedTranslateX }]
                    },
                    contentContainerStyle
                ]}
                {...(enableSwipeGesture ? panResponder.panHandlers : {})}
            >
                {tabs.map((tab, index) => (
                    <View
                        key={tab.key}
                        style={[styles.contentPage, { width: screenDimensions.width }]}
                    >
                        {tab.content}
                    </View>
                ))}
            </Animated.View>
        );
    }, [tabs, contentOffset, panValue, contentContainerStyle, enableSwipeGesture, panResponder, screenDimensions.width]);

    return (
        <View style={styles.container}>
            {/* Tab Bar */}
            <View style={[
                styles.tabBar,
                {
                    backgroundColor: tabBarBackgroundColor,
                    height: tabBarHeight
                },
                tabBarStyle
            ]}>
                {scrollableTabs ? (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollableTabBar}
                    >
                        {tabs.map(renderTab)}
                    </ScrollView>
                ) : (
                    <View style={styles.fixedTabBar}>
                        {tabs.map(renderTab)}
                    </View>
                )}

                {/* Active Indicator - White line below active tab */}
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            width: tabWidth,
                            height: indicatorHeight,
                            backgroundColor: activeIndicatorColor,
                            transform: [{ translateX: indicatorPosition }],
                        },
                    ]}
                />
            </View>

            {/* Content Area */}
            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
};

/**
 * Default styles for the CustomTab component
 */
const styles = StyleSheet.create({
    /**
     * Main container
     */
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE.PURE_WHITE,
    },

    /**
     * Tab bar container with green background
     */
    tabBar: {
        flexDirection: 'row',
        position: 'relative',
        // elevation: 4, // Android shadow
        // shadowColor: '#000', // iOS shadow
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
    },

    /**
     * Scrollable tab bar
     */
    scrollableTabBar: {
        flex: 1,
    },

    /**
     * Fixed tab bar
     */
    fixedTabBar: {
        flex: 1,
        flexDirection: 'row',
    },

    /**
     * Individual tab button - same background as tab bar
     */
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    /**
     * Tab content wrapper
     */
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    /**
     * Tab text
     */
    tabText: {
        fontSize: 16,
        textAlign: 'center',
    },

    /**
     * Disabled tab
     */
    disabledTab: {
        opacity: 0.5,
    },

    /**
     * Disabled text
     */
    disabledText: {
        color: COLOR.GREEN.WHITE_GREEN,
    },

    /**
     * Active indicator - white line below active tab
     */
    indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderRadius: 2,
    },

    /**
     * Content area
     */
    content: {
        flex: 1,
        overflow: 'hidden',
    },

    /**
     * Content container
     */
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    /**
     * Individual content page
     */
    contentPage: {
        flex: 1,
        backgroundColor: COLOR.WHITE.PURE_WHITE,
    },
});

export default CustomTab;