import React, { useContext } from 'react';
import { Appearance, View } from 'react-native';
import { PropsContext } from '../Chatty';
let isLoaded: boolean = false;

try {
  require('moti');
  require('expo-linear-gradient');
  isLoaded = true;
} catch {
  console.warn(
    'Moti and expo-linear-gradient is not installed. Skeleton loader will not work.'
  );
}

export function Skeleton(props: any) {
  const propsContext = useContext(PropsContext);

  if (propsContext?.enableSkeletonLoader && isLoaded) {
    const SS = require('moti/skeleton').Skeleton;

    console.log(SS);

    return (
      <SS colorMode={Appearance.getColorScheme()} {...props}>
        {props.children}
      </SS>
    );
  }

  return <View>{props.children}</View>;
}
