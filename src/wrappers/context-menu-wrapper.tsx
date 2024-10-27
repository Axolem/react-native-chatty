import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { Platform, Text, View } from 'react-native';
import { PropsContext } from '../components/props-context';
import type { IMessage } from '../types/chatty.types';
import { contextMenuView } from '../utils/context-menu';
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
  if (!propsContext.bubbleProps?.actions) return props.children;

  if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13) {
    return (
      <contextMenuView.default
        actions={propsContext.bubbleProps?.actions?.options}
        onPress={(e: any) => onPress(e.nativeEvent.index)}
      >
        {props.children}
      </contextMenuView.default>
    );
  }
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={onChange}
    >
      <View>
        <Text>Awesome 🎉</Text>
      </View>
    </BottomSheet>
  );
}

export { ContextMenuWrapper };
