import { AppItem } from "../../../../types/myProfile.type";

/**
 * Filter applications based on search query
 */
export const filterApplications = (applications: AppItem[], searchQuery: string): AppItem[] => {
    if (searchQuery.trim() === '') {
        return applications;
    }

    const query = searchQuery.toLowerCase();

    return applications.filter(app =>
        app.app_name?.toLowerCase().startsWith(query)
    );
};
