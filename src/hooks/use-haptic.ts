import { useCallback } from 'react';
import type { HapticType } from '../types/chatty.types';
import { triggerHaptic } from '../utils/haptic-engine';

/**
 * `useHaptic` returns a `trigger` function that triggers haptic feedback
 * @returns A function that triggers haptic feedback.
 */
export function useHaptic() {
  const trigger = useCallback(async (type: HapticType) => {
    await triggerHaptic(type).catch((err) =>
      console.error('Error while triggering haptic', err)
    );
  }, []);

  return { trigger };
}
