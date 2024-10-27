import dayjs from 'dayjs';
import type { ForwardedRef } from 'react';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, View } from 'react-native';
import { Footer } from './footer';

import { List } from './list';
import type { IChatty, ListRef } from './types/chatty.types';
import { PropsContext } from './components/props-context';
import {
  KeyboardAvoiderProvider,
  KeyboardAvoiderScrollView,
} from '@good-react-native/keyboard-avoider';

export const Chatty = forwardRef(
  (props: IChatty, ref: ForwardedRef<ListRef>) => {
    const listRef = useRef<ListRef>();
    const { messages } = props;

    /* This is a way to scroll to the end of the list when the keyboard is shown. */
    useEffect(() => {
      const listener = Keyboard.addListener('keyboardDidShow', () => {
        if (listRef.current) {
          listRef.current?.scrollToEnd(true);
        } else if (ref) {
          //@ts-ignore
          ref.current?.scrollToEnd(true);
        } else {
          console.warn('No ref found');
        }
      });

      return () => {
        listener.remove();
      };
    }, [ref]);

    useEffect(() => {
      if (props?.setDateLocale) {
        dayjs.locale(props.setDateLocale);
      }
    }, [props.setDateLocale]);

    const renderLoading = useCallback(() => {
      return (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator />
        </View>
      );
    }, []);

    return (
      <KeyboardAvoiderProvider>
        <PropsContext.Provider value={props}>
          {props?.renderHeader?.(props.headerProps)}

          <KeyboardAvoiderScrollView>
            {props.messages.length < 1 ? (
              renderLoading()
            ) : (
              <>
                <List
                  data={messages}
                  //@ts-ignore
                  ref={ref ?? listRef}
                  rowRenderer={
                    props?.renderBubble ? props.renderBubble : undefined
                  }
                  {...props.listProps}
                />
                {props?.renderFooter ? (
                  props.renderFooter(props.footerProps)
                ) : (
                  <Footer
                    {...props.footerProps}
                    replyingTo={props.replyingTo}
                  />
                )}
              </>
            )}
          </KeyboardAvoiderScrollView>
        </PropsContext.Provider>
      </KeyboardAvoiderProvider>
    );
  }
);

export const styles = StyleSheet.create({
  loadingContainer: {
    height: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
