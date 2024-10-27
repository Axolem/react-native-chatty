import { Text, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import type { IRenderDateProps } from 'src/types/chatty.types';
import { memo } from 'react';

function _RenderDate(props: IRenderDateProps) {
  const { date, containerStyle, labelStyle } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>
        {dayjs(date).isSame(new Date(), 'day')
          ? 'Today'
          : dayjs(date).format('dddd D MMM')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 100,
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
});

export const RenderDate = memo(_RenderDate);
