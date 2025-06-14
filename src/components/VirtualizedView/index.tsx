import { FlatList } from 'react-native'
import React, { ReactNode } from 'react';

interface VirtualizedViewProps {
    children: ReactNode;
}

const VirtualizedView: React.FC<VirtualizedViewProps> = (props) => {
    return (
        <FlatList
            data={[]}
            ListEmptyComponent={null}
            keyExtractor={() => "dummy"}
            renderItem={null}
            ListHeaderComponent={() => (
                <React.Fragment>{props.children}</React.Fragment>
            )}
        />
    );
};


export default VirtualizedView;