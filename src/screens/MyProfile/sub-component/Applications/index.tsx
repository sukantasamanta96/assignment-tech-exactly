// Applications component will appear here
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Keyboard } from "react-native";
import ApiService from '../../../../api/api-service';
import { API_URLS } from '../../../../api/api-routes';
import ListItem from '../../../../sections/ListItem';
import CustomTextInput from '../../../../components/CustomTextInput';
import { ApiResponse, AppItem } from '../../../../types/myProfile.type';
import { filterApplications } from './function';
import { COLOR } from '../../../../constants/color_code';

const Applications: React.FC = () => {
    const [applications, setApplications] = useState<AppItem[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<AppItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [switchValues, setSwitchValues] = useState<Record<number, boolean>>({});

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            // to get the api data
            const response: ApiResponse = await ApiService.post(API_URLS.POST_APPS_LIST, {
                "kid_id": "378"
            });
            if (response.data.success && response.data && response.data.data.app_list) {
                const appsData = response.data.data.app_list;
                setApplications(appsData);
                setFilteredApplications(appsData);

                // Initialize switch values for each application
                const initialSwitchValues: Record<number, boolean> = {};
                appsData.forEach((app) => {
                    initialSwitchValues[app.app_id] = app.status.toLowerCase() === 'active';
                });
            } else {
                setApplications([]);
                setFilteredApplications([]);
            }
        } catch (error) {
            setApplications([]);
            setFilteredApplications([]);
        } finally {
            setLoading(false);
        }
    };

    // change the search text and filter the item list
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        const filtered = filterApplications(applications, text);
        setFilteredApplications(filtered);
    };

    // for handle the switch
    const handleSwitchToggle = (appId: number) => {
        setSwitchValues(prev => ({
            ...prev,
            [appId]: !prev[appId]
        }));
    };

    // for render the Items
    const renderApplicationItem = ({ item }: { item: AppItem }) => {
        return (
            <ListItem
                title={item.app_name}
                imageUrl={item.app_icon}
                switchValue={switchValues[item.app_id] || false}
                onSwitchToggle={() => handleSwitchToggle(item.app_id)}
            />
        );
    };

    // for render empty component
    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {loading ? 'Loading applications...' : 'No applications found'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <CustomTextInput
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    returnKeyType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                    selectTextOnFocus={false}
                />
            </View>
            <FlatList
                data={filteredApplications}
                renderItem={renderApplicationItem}
                keyExtractor={(item, index) => `${item.app_id}-${index}`}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyComponent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                removeClippedSubviews={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                extraData={switchValues}
                onScrollBeginDrag={() => Keyboard.dismiss()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE.PURE_WHITE,
    },
    searchContainer: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    listContainer: {
        paddingBottom: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: COLOR.GRAY.GRAY_COLOR,
        textAlign: 'center',
    },
});

export default Applications;