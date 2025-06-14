import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle,
    Alert,
} from 'react-native';
import BackIcon from '../../assets/icons-components/BackIcon';
import CustomImage from '../../components/CustomImage';
import { COLOR } from '../../constants/color_code';
import CheckMarkIcon from '../../assets/icons-components/CheckMarkIcon';
import { APP_DATA } from '../../constants/app_data';

/**
 * Props interface for the ProfileCard component
 */
interface ProfileCardProps {
    /** Custom styling for the main container */
    containerStyle?: ViewStyle;
    /** Custom styling for the profile name */
    nameStyle?: TextStyle;
    /** Custom styling for the status text */
    statusStyle?: TextStyle;
    /** Custom styling for the profile image */
    imageStyle?: ImageStyle;
    /** Callback function when back button is pressed */
    onBackPress?: () => void;
    /** Profile image URL (optional - uses default if not provided) */
    profileImageUrl?: string;
    /** Profile name (optional - uses default if not provided) */
    profileName?: string;
}

/**
 * ProfileCard Component
 * A profile card component with back button, profile image, name, and connection status
 */
const ProfileHeader: React.FC<ProfileCardProps> = ({
    containerStyle,
    nameStyle,
    statusStyle,
    imageStyle,
    onBackPress,
    profileImageUrl = APP_DATA.PROFILE_IMG,
    profileName = APP_DATA.NAME,
}) => {
    /**
     * Handle back button press
     */
    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            Alert.alert('Back button pressed');
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>

            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <BackIcon height={20} width={20} />
                </TouchableOpacity>
            </View>

            {/* Profile Content */}
            <View style={styles.content}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    <CustomImage
                        source={{ uri: profileImageUrl }}
                        style={[styles.profileImage, imageStyle]}
                        resizeMode="contain"
                    />
                </View>

                {/* Profile Name */}
                <Text
                    style={[styles.profileName, nameStyle]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {profileName}
                </Text>

                {/* Connection Status */}
                <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, statusStyle]}>
                        {APP_DATA.STATUS}
                    </Text>
                    <CheckMarkIcon height={25} width={25} />
                </View>
            </View>
        </View>
    );
};

/**
 * Default styles for the ProfileCard component
 */
const styles = StyleSheet.create({
    /**
     * Main container with green background
     */
    container: {
        flex:1,
        backgroundColor: COLOR.GREEN.SEA_GREEN,
        paddingTop: 10,
    },

    /**
     * Header section with back button
     */
    header: {
        paddingHorizontal: 5,
    },

    /**
     * Back button styling
     */
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /**
     * Back arrow icon
     */
    backIcon: {
        fontSize: 24,
        color: COLOR.WHITE.PURE_WHITE,
        fontWeight: 'bold',
    },

    /**
     * Main content area
     */
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 20
    },

    /**
     * Container for profile image with white border
     */
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: COLOR.WHITE.PURE_WHITE,
        marginBottom: 10
    },

    /**
     * Profile image styling
     */
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 56,
    },

    /**
     * Profile name text styling
     */
    profileName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLOR.WHITE.PURE_WHITE,
        marginBottom: 10,
        textAlign: 'center',
    },

    /**
     * Status container with background and rounded corners
     */
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE.PURE_WHITE,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
    },

    /**
     * Status text styling
     */
    statusText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLOR.BLACK.PURE_BLACK,
        marginRight: 8,
    },
});

export default ProfileHeader;