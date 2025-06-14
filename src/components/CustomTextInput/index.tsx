import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import SearchIcon from '../../assets/icons-components/SearchIcon';
import { COLOR } from '../../constants/color_code';

/**
 * Props interface for the Custom Text Input component
 */
interface CustomTextInputProps extends TextInputProps {
    /** Callback function triggered when the search icon is pressed */
    onSearchPress?: () => void;
    /** Custom styling for the outer container */
    containerStyle?: object;
    /** Custom styling for the TextInput element */
    inputStyle?: object;
    /** Size of the search icon in pixels */
    iconSize?: number;
    /** is show the search icon*/
    isShowSearchIcon?: boolean;
}

/**
 * Custom Text Input Component
 * 
 */
const CustomTextInput: React.FC<CustomTextInputProps> = ({
    onSearchPress,
    containerStyle,
    inputStyle,
    iconSize = 20,
    placeholder = 'Search',
    isShowSearchIcon = true,
    ...textInputProps
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {/* Main text input field */}
            <TextInput
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                placeholderTextColor={COLOR.GRAY.GRAY_COLOR}
                underlineColorAndroid="transparent"
                selectionColor={COLOR.BLACK.PURE_BLACK}
                {...textInputProps}
            />

            {/* Search icon button */}
            {isShowSearchIcon && (
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={onSearchPress}
                    activeOpacity={0.7}
                    accessible={true}
                    accessibilityLabel="Search button"
                    accessibilityHint="Tap to perform search"
                >
                    <SearchIcon height={iconSize} width={iconSize} />
                </TouchableOpacity>
            )}
        </View>
    );
};

/**
 * Default styles for the Custom Text component
 */
const styles = StyleSheet.create({
    /**
     * Main container that wraps the entire search input
     */
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE.PURE_WHITE,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: COLOR.GRAY.GRAY_COLOR,
        minHeight: 44
    },

    /**
     * Styles for the TextInput element
     */
    input: {
        flex: 1,
        fontSize: 16,
        color: COLOR.BLACK.PURE_BLACK,
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0,
        backgroundColor: 'transparent',
        minHeight: 20
    },

    /**
     * Container for the search icon
     */
    iconContainer: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        marginLeft: 8,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomTextInput;