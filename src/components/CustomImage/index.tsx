import React, { useState } from 'react';
import {
    Image,
    ImageProps,
    View,
    StyleSheet,
    ImageSourcePropType,
} from 'react-native';
import { COLOR } from '../../constants/color_code';

/**
 * Props interface for the CustomImage component
 */
interface CustomImageProps extends ImageProps {
    /** Local fallback image to display when main image fails to load */
    fallbackSource?: ImageSourcePropType;
    /** Whether to show grey placeholder during loading and on error */
    showPlaceholder?: boolean;
    /** Background color of the placeholder */
    placeholderColor?: string;
}

/**
 * CustomImage Component
 */
const CustomImage: React.FC<CustomImageProps> = ({
    fallbackSource,
    showPlaceholder = true,
    placeholderColor = COLOR.BLACK.PURE_BLACK,
    style,
    source,
    ...imageProps
}) => {
    // State to track image loading and error status
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Handles image loading errors
     * Sets error state and stops loading indicator
     */
    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    /**
     * Handles successful image loading
     * Clears error state and stops loading indicator
     */
    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    /**
     * Handles start of image loading
     * Resets states when loading begins
     */
    const handleLoadStart = () => {
        setIsLoading(true);
        setHasError(false);
    };

    // If there's an error and we have a fallback source, use it
    if (hasError && fallbackSource) {
        return (
            <Image
                {...imageProps}
                source={fallbackSource}
                style={style}
                onError={() => {
                    // If fallback also fails, show placeholder
                    setHasError(true);
                }}
                onLoad={handleLoad}
                onLoadStart={handleLoadStart}
            />
        );
    }

    // If there's an error and no fallback, show placeholder
    if (hasError && showPlaceholder) {
        return (
            <View
                style={[
                    styles.placeholder,
                    style,
                    { backgroundColor: placeholderColor }
                ]}
            />
        );
    }

    // Show loading placeholder while image is loading
    if (isLoading && showPlaceholder) {
        return (
            <View style={[style, styles.container]}>
                {/* White placeholder shown during loading */}
                <View
                    style={[
                        styles.placeholder,
                        StyleSheet.absoluteFill,
                        { backgroundColor: placeholderColor }
                    ]}
                />
                {/* Actual image loading in background */}
                <Image
                    {...imageProps}
                    source={source}
                    style={[StyleSheet.absoluteFill]}
                    onError={handleError}
                    onLoad={handleLoad}
                    onLoadStart={handleLoadStart}
                />
            </View>
        );
    }

    // Normal image rendering when loaded successfully
    return (
        <Image
            {...imageProps}
            source={source}
            style={style}
            onError={handleError}
            onLoad={handleLoad}
            onLoadStart={handleLoadStart}
        />
    );
};

/**
 * Default styles for the CustomImage component
 */
const styles = StyleSheet.create({
    /**
     * Container for image with placeholder overlay
     */
    container: {
        position: 'relative',
    },

    /**
     * White placeholder background
     */
    placeholder: {
        backgroundColor: COLOR.WHITE.PURE_WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomImage;