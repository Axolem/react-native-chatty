import dayjs from 'dayjs';
import type { ForwardedRef, Ref } from 'react';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AnimatedFlashList,
  FlashList,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import { ChatBubble } from './chat-bubble';
import { PropsContext } from './components/props-context';
import { SwipeableBubble } from './swipeable-bubble';
import { FAB, IFabRef } from './components/fab';
import { LoadEarlier } from './components/load-earlier';
import { RenderDate } from './components/render-date';
import { TypingStatus } from './components/typing-status';
import { useHaptic } from './hooks/use-haptic';
import { usePrevious } from './hooks/use-previous';
import {
  HapticType,
  IListProps,
  IMessage,
  ITypingStatusRef,
  LayoutType,
  ListRef,
} from './types/chatty.types';
import { ChatBubbleEmitter } from './utils/event-emitter';
import { wait } from './utils/helpers';

const ScrollViewWithHeader = forwardRef(
  ({ children, ...props }: ScrollViewProps, ref: Ref<ScrollView>) => {
    const propsContext = useContext(PropsContext);

    return (
      <ScrollView ref={ref} {...props}>
        {propsContext?.loadEarlierProps &&
          propsContext.loadEarlierProps.show && (
            <LoadEarlier {...propsContext.loadEarlierProps} />
          )}
        {children}
      </ScrollView>
    );
  }
);

export const List = forwardRef(
  (props: IListProps, ref: ForwardedRef<ListRef>) => {
    const propsContext = useContext(PropsContext);
    const flashListRef = useRef<FlashList<IMessage>>();
    const windowDimensions = useWindowDimensions();
    const safeArea = useSafeAreaInsets();
    const { trigger } = useHaptic();
    const fabRef = useRef<IFabRef>(null);
    const typingStatusRef = useRef<ITypingStatusRef>(null);
    const listHeight = useMemo(
      () => windowDimensions.height - 150 - safeArea.bottom - safeArea.top,
      [windowDimensions, safeArea]
    );
    const { rowRenderer: rowRendererProp, data } = props;

    const [messages, setMessages] = useState<IMessage[]>([]);
    const previousMessages = usePrevious<IMessage[]>(messages);

    /* This is a React Hook that is used to update the messages list when new messages are added. */
    useEffect(() => {
      setMessages(data);
    }, [data]);

    /* This code is listening to the event of a reply bubble being pressed. When it is pressed, it scrolls
to the replied message. */
    useEffect(() => {
      // When reply is pressed, scroll to replied message
      ChatBubbleEmitter.addListener('replyBubblePressed', (messageId) => {
        const index = messages.findIndex((m) => m.id === messageId);

        if (index !== -1) {
          flashListRef.current?.scrollToIndex({ index, animated: true });
        }
      });

      return () => {
        ChatBubbleEmitter.removeAllListeners();
      };
    }, [messages]);

    /* Using the useImperativeHandle hook to expose a function to the parent component that will allow
    it to manipulate the messages list. */
    useImperativeHandle(
      ref,
      () => ({
        appendMessage: (
          message: IMessage | IMessage[],
          firstIndex?: boolean
        ) => {
          if (firstIndex) {
            if (Array.isArray(message)) {
              setMessages([...message, ...messages]);
            } else {
              setMessages([message, ...messages]);
            }
          } else {
            if (Array.isArray(message)) {
              setMessages([...messages, ...message]);
            } else {
              setMessages([...messages, message]);
            }
          }

          if (!Array.isArray(message)) {
            if (!message.me && propsContext?.enableHapticFeedback) {
              if (Platform.OS !== 'web') {
                trigger(HapticType.Heavy);
              }
            }
          }
        },
        /* This is a function that is used to scroll to the bottom of the list. */
        scrollToEnd: (animated?: boolean) => {
          flashListRef.current?.scrollToEnd({ animated });
        },
        /* Setting the typing status of the user. */
        setIsTyping: (typing?: boolean) => {
          typingStatusRef.current?.setIsTyping(typing ?? false);
          flashListRef.current?.scrollToEnd({ animated: true });
        },
        /* Removing a message from the list of messages. */
        removeMessage: (id: number) => {
          setMessages(messages.filter((message) => message.id !== id));
        },
      }),
      [messages, propsContext.enableHapticFeedback, trigger]
    );

    /* This code is checking if the first message in the previous messages is the same as the first message
in the current messages. If it is, then it will not scroll to the bottom. */
    useEffect(() => {
      if (previousMessages && previousMessages[0]?.id === messages[0]?.id) {
        wait(100).then(() => {
          flashListRef.current?.scrollToEnd({ animated: true });
        });
      }
    }, [ref, messages, previousMessages]);

    const getItemType = useCallback(
      (item: IMessage, index: number) => {
        const prevMessage: IMessage = messages[index - 1];

        if (item.text.length >= 600) {
          return LayoutType.ExtremeLong;
        }

        if (item.text.length >= 400) {
          return LayoutType.Long3x;
        }

        if (item.text.length >= 200) {
          return LayoutType.Long2x;
        }

        if (item.text.length >= 100) {
          return LayoutType.Long;
        }

        if (item?.media) {
          if (item.media.length > 2) {
            return LayoutType.Media2x;
          }

          return LayoutType.Media;
        }

        if (item.repliedTo) {
          return LayoutType.Replied;
        }

        const isFirstMessage = index === 0;

        if (
          (!isFirstMessage &&
            dayjs(item.createdAt).date() !==
              dayjs(prevMessage.createdAt).date()) ||
          isFirstMessage
        ) {
          return LayoutType.Dated;
        }

        return LayoutType.Normal;
      },
      [messages]
    );

    const renderBubble = useCallback(
      (data: IMessage, withDate?: boolean) => {
        if (rowRendererProp) {
          return (
            <View>
              {withDate && (
                <RenderDate
                  date={data.createdAt}
                  {...propsContext.renderDateProps}
                />
              )}

              <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
                <SwipeableBubble message={data} onReply={propsContext.onReply}>
                  {rowRendererProp(data)}
                </SwipeableBubble>
              </Animated.View>
            </View>
          );
        }

        return (
          <View style={{ width: '100%' }}>
            {withDate && (
              <RenderDate
                date={data.createdAt}
                {...propsContext.renderDateProps}
              />
            )}
            <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
              {propsContext.onReply ? (
                <SwipeableBubble
                  message={data}
                  onReply={propsContext.onReply}
                />
              ) : (
                <ChatBubble message={data} />
              )}
            </Animated.View>
          </View>
        );
      },
      [propsContext.onReply, propsContext.renderDateProps, rowRendererProp]
    );

    const rowRenderer = useCallback(
      ({ index, item, extraData }: ListRenderItemInfo<IMessage>) => {
        const type = flashListRef.current?.props.getItemType!(
          item,
          index,
          extraData
        );

        if (type === LayoutType.Dated) {
          return renderBubble(item, true);
        }

        return renderBubble(item);
      },
      [renderBubble]
    );

    const onScroll = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (e.nativeEvent.contentOffset.y <= 0) {
          fabRef.current?.show();
        } else {
          fabRef.current?.hide();
        }

        if (props.onScroll) {
          props.onScroll(e);
        }
      },
      [props]
    );

    const scrollToBottom = useCallback(() => {
      flashListRef.current?.scrollToEnd({ animated: true });
    }, []);

    return (
      <View style={{ minWidth: 1, minHeight: 1, height: listHeight }}>
        {propsContext.showScrollToBottomButton && (
          <FAB
            ref={fabRef}
            onPress={scrollToBottom}
            {...propsContext.scrollToBottomProps}
          />
        )}

        <AnimatedFlashList
          estimatedItemSize={230}
          // !TODO: Fix this
          // renderScrollComponent={ScrollViewWithHeader}
          renderItem={rowRenderer}
          data={messages}
          getItemType={getItemType}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 10 }}
          // @ts-ignore
          style={[
            {
              height: propsContext.replyingTo ? '90%' : '100%',
            },
            { ...props.containerStyle },
          ]}
          // @ts-ignore
          ref={flashListRef}
          overrideProps={{
            keyboardShouldPersistTaps: 'never',
          }}
          onScroll={onScroll}
          optimizeForInsertDeleteAnimations
          renderFooter={() => <TypingStatus ref={typingStatusRef} />}
          onEndReached={props?.onEndReached}
          onEndReachedThreshold={props?.onEndReachedThreshold}
        />
      </View>
    );
  }
);
