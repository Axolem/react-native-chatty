import React, { useCallback, useContext, useRef } from 'react';
import { Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ChatBubble } from './chat-bubble';
import { PropsContext } from './components/props-context';
import type { ISwipeableBubble } from './types/chatty.types';

function _SwipeableBubble(props: ISwipeableBubble) {
  const { onReply, message, children } = props;
  const propsContext = useContext(PropsContext);
  const swipeableRef = useRef(null);

  const _onReply = useCallback(() => {
    if (!message) return;

    onReply!(message);
    //@ts-ignore
    swipeableRef.current?.close();
  }, [message, onReply, swipeableRef]);

  const renderLeftActions = useCallback(() => {
    return propsContext.bubbleProps?.replyDragElement ?? <Text> </Text>;
  }, [propsContext.bubbleProps?.replyDragElement]);

  if (!onReply) return children ?? <ChatBubble {...props} />;

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      friction={2}
      overshootFriction={8}
      onEnded={() => _onReply()}
      renderRightActions={renderLeftActions}
      enableTrackpadTwoFingerGesture
      ref={swipeableRef}
    >
      {children ?? <ChatBubble {...props} />}
    </Swipeable>
  );
}

export const SwipeableBubble = React.memo(_SwipeableBubble);
