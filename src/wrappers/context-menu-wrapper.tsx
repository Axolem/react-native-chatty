import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { Platform, Text, View } from 'react-native';
import { PropsContext } from '../components/props-context';
import type { IMessage } from '../types/chatty.types';
import { ContextMenuView } from '../utils/context-menu';
import { ChatEmitter } from '../utils/event-emitter';

interface IProps {
  message: IMessage;
  children: JSX.Element;
}

function ContextMenuWrapper(props: IProps) {
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const propsContext = useContext(PropsContext);

  const onPress = useCallback(
    (index: number) => {
      ChatEmitter.emit('actionPressed', index, props.message);
    },
    [props.message]
  );

  const onChange = useCallback(() => {}, []);

  // If actions are not defined, just return the children
  // if (!propsContext.bubbleProps?.actions) return props.children;

  // if (
  //   (Platform.OS === 'ios' || Platform.OS === 'android') &&
  //   parseInt(Platform.Version as string, 10) >= 13 &&
  //   ContextMenuView
  // ) {
  // return props.children;
  return <ContextMenuView>{props.children}</ContextMenuView>;
  // }

  // return (
  //   <BottomSheet
  //     ref={bottomSheetRef}
  //     index={1}
  //     snapPoints={snapPoints}
  //     onChange={onChange}
  //   >
  //     <View>
  //       <Text>Awesome 🎉</Text>
  //     </View>
  //   </BottomSheet>
  // );
}

export { ContextMenuWrapper };
