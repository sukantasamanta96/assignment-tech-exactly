import React from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import { COLOR } from '../../constants/color_code';
import CustomImage from '../../components/CustomImage';

/**
 * Props interface for the ListItem component
 */
interface ListItemProps {
    /** Main title text displayed on the list item */
    title: string;
    /** Image URL to display */
    imageUrl: string;
    /** Switch value (true/false) */
    switchValue: boolean;
    /** Callback function triggered when switch is toggled */
    onSwitchToggle: (value: boolean) => void;
    /** Custom styling for the list item container */
    containerStyle?: ViewStyle;
    /** Custom styling for the title text */
    titleStyle?: TextStyle;
    /** Custom styling for the image */
    imageStyle?: ImageStyle;
    /** Size of the image (default: 50) */
    imageSize?: number;
    /** Whether the switch is disabled */
    disabled?: boolean;
}

/**
 * ListItem Component
 */
const ListItem: React.FC<ListItemProps> = ({
    title,
    imageUrl,
    switchValue,
    onSwitchToggle,
    containerStyle,
    titleStyle,
    imageStyle,
    imageSize = 50,
    disabled = false,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {/* Image Section */}
            <CustomImage
                source={{ uri: imageUrl }}
                style={[
                    styles.image,
                    {
                        width: imageSize,
                        height: imageSize,
                    },
                    imageStyle
                ]}
                resizeMode="cover"
                accessible={true}
            />

            {/* Title */}
            <Text
                style={[
                    styles.title,
                    disabled && styles.disabledText,
                    titleStyle
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>

            {/* Switch */}
            <Switch
                value={switchValue}
                onValueChange={onSwitchToggle}
                disabled={disabled}
                trackColor={{
                    false: COLOR.GRAY.GRAY_COLOR,
                    true: COLOR.GREEN.SEA_GREEN
                }}
                thumbColor={switchValue ? COLOR.GREEN.SEA_GREEN : COLOR.WHITE.PURE_WHITE}
            />
        </View>
    );
};

/**
 * Default styles for the ListItem component
 */
const styles = StyleSheet.create({
    /**
     * Main container for the list item
     */
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE.PURE_WHITE,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    /**
     * Image styling
     */
    image: {
        marginRight: 16,
    },

    /**
     * Title text styling
     */
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.BLACK.PURE_BLACK,
        marginRight: 16,
    },

    /**
     * Disabled text styling
     */
    disabledText: {
        color: COLOR.GRAY.GRAY_COLOR,
    },
});

export default ListItem;