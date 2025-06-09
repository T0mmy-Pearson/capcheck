// This is a shim for web and Android where the tab bar is generally opaque.
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default undefined;

export function useBottomTabOverflow() {
  try { 
    return 0;
  } catch {
    const insets = useSafeAreaInsets();
    return insets.bottom ?? 0
  }
}
