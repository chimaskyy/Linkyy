import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({name, focused, color, size}) => {
  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'Dashboard':
        return 'dashboard';
      case 'URLs':
        return 'link';
      case 'LinkTrees':
        return 'account-tree';
      case 'QRCodes':
        return 'qr-code';
      case 'Profile':
        return 'person';
      default:
        return 'help';
    }
  };

  return (
    <Icon
      name={getIconName(name)}
      size={size}
      color={color}
      style={{opacity: focused ? 1 : 0.7}}
    />
  );
};

export default TabBarIcon;