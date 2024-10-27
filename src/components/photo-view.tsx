import type { ViewSource } from '@trial-trl/react-native-image-viewing/dist/ImageViewing';
import { useCallback } from 'react';
import { videoRef } from '../utils/video-renderer';
import { PhotoView as _PhotoView } from '../utils/photo-view';

interface IProps {
  views: ViewSource[];
  visible: boolean;
  onRequestClose: () => void;
}

export const PhotoView = (props: IProps) => {
  const { onRequestClose } = props;

  const _onRequestClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current?.unloadAsync();
    }
    onRequestClose();
  }, [onRequestClose]);

  const _onImageIndexChange = useCallback(() => {
    if (videoRef.current) {
      videoRef.current?.unloadAsync();
    }
  }, []);

  if (_PhotoView) {
    return (
      <_PhotoView
        {...props}
        onRequestClose={_onRequestClose}
        onImageIndexChange={_onImageIndexChange}
        swipeToCloseEnabled
      />
    );
  }

  return null;
};
