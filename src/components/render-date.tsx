import { Text, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import type { IRenderDateProps } from 'src/types/chatty.types';
import { memo } from 'react';

function _RenderDate(props: IRenderDateProps) {
  const { date, containerStyle, labelStyle } = props;

  return (
    <View style={containerStyle ?? styles.container}>
      <Text style={labelStyle ?? styles.label}>
        {dayjs(date).format('dddd D MMM')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 5,
  },
  label: {
    color: '#fff',
  },
});

export const RenderDate = memo(_RenderDate);
