// icon component for back
import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

const BackIcon = (props: SvgProps) => (
    <Svg
        fill="#ffffff"
        width="800px"
        height="800px"
        viewBox="0 0 52 52"
        data-name="Layer 1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G data-name="Group 132" id="Group_132">
            <Path d="M38,52a2,2,0,0,1-1.41-.59l-24-24a2,2,0,0,1,0-2.82l24-24a2,2,0,0,1,2.82,0,2,2,0,0,1,0,2.82L16.83,26,39.41,48.59A2,2,0,0,1,38,52Z" />
        </G>
    </Svg>
);
export default BackIcon;