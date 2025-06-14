// for App list Item
export interface AppItem {
    app_id: number;
    fk_kid_id: number;
    kid_profile_image: string;
    app_name: string;
    app_icon: string;
    app_package_name: string;
    status: string;
}

// for App list Item Response
export interface ApiResponse {
    data: {
        success: boolean;
        data: {
            app_list: AppItem[];
            usage_access: number;
        };
        message: string;
    }
}