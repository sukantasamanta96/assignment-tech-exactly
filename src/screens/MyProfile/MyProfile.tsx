// MyProfile Main component will appear here
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import ProfileHeader from '../../sections/ProfileHeader';
import ApplicationsPage from './sub-component/Applications';
import SettingsPage from './sub-component/Settings';
import { COLOR } from '../../constants/color_code';
import CustomTab from '../../components/CustomTab';
import VirtualizedView from '../../components/VirtualizedView';

const MyProfile: React.FC = () => {
    // Tab Items here
    const tabs = [
        {
            key: 'applications',
            title: 'Applications',
            content: <ApplicationsPage />
        },
        {
            key: 'settings',
            title: 'Settings',
            content: <SettingsPage />
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <ProfileHeader />
                    <View style={styles.tabContainer}>
                        <CustomTab
                            tabs={tabs}
                            initialTab="applications"
                        />
                    </View>
                </ScrollView>
            </VirtualizedView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE.PURE_WHITE
    },
    tabContainer: {
        flex: 1,
        backgroundColor: COLOR.WHITE.PURE_WHITE
    },
});

export default MyProfile;