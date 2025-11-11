import React, { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

interface ResponsiveWrapperProps {
  children: ReactNode;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ children }) => {
  const { width } = useWindowDimensions();

  // Example breakpoints
  const isTablet = width >= 768 && width < 1280;
  const isDesktop = width >= 1280;

  let paddingHorizontal = 12;
  let maxWidth;

  if (isTablet) {
    paddingHorizontal = 40;
    maxWidth = 900;
  } else if (isDesktop) {
    paddingHorizontal = 120;
    maxWidth = 1200;
  }

  return (
    <View style={[styles.base, { paddingHorizontal }, maxWidth ? { alignSelf:'center', width: '100%', maxWidth } : {} ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },
});

export default ResponsiveWrapper;
