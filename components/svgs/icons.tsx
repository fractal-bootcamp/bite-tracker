import { Svg, Path, Circle } from 'react-native-svg';

export const FatIcon = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
            d="M50 5 C80 5, 95 35, 95 65 C95 85, 75 95, 50 95 C25 95, 5 85, 5 65 C5 35, 20 5, 50 5"
            fill="#FFC107"
            stroke="#FFA000"
            strokeWidth="2"
        />
        <Path
            d="M35 25 C45 15, 60 25, 65 40"
            fill="none"
            stroke="#FFE082"
            strokeWidth="3"
            strokeLinecap="round"
        />
    </Svg>
);

export const CarbsIcon = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="40" fill="#8D6E63" />
        <Path
            d="M30 30 L70 70 M40 25 L75 60 M25 40 L60 75"
            stroke="#D7CCC8"
            strokeWidth="6"
            strokeLinecap="round"
        />
        <Circle cx="50" cy="50" r="15" fill="#D7CCC8" />
    </Svg>
);

export const ProteinIcon = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="40" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
        <Path
            d="M30 50 Q50 20, 70 50 Q50 80, 30 50"
            fill="none"
            stroke="#81C784"
            strokeWidth="8"
            strokeLinecap="round"
        />
        <Circle cx="30" cy="50" r="6" fill="#81C784" />
        <Circle cx="70" cy="50" r="6" fill="#81C784" />
    </Svg>
);

export const CaloriesIcon = ({ size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
            d="M50 5 C70 25, 90 45, 90 70 C90 85, 75 95, 50 95 C25 95, 10 85, 10 70 C10 45, 30 25, 50 5"
            fill="#FF5722"
        />
        <Path
            d="M50 20 C60 35, 70 50, 70 65 C70 80, 60 85, 50 85 C40 85, 30 80, 30 65 C30 50, 40 35, 50 20"
            fill="#FFCCBC"
        />
    </Svg>
);
