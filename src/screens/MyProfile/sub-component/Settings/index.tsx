// Settings component will appear here
import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { COLOR } from '../../../../constants/color_code';

const SettingsPage: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.contentBox}>
                <Text style={styles.contentText}>Settings</Text>
                <Text style={styles.descriptionText}>
                    This is the settings section where you can configure your preferences.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 200,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE.PURE_WHITE,
    },
    contentBox: {
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        shadowColor: COLOR.BLACK.PURE_BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minWidth: '100%',
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 14,
        textAlign: 'center',
        color: COLOR.BLACK.PURE_BLACK,
    },
});

export default SettingsPage;