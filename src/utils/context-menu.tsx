import { FC } from 'react';
import { HoldMenuProvider } from '@manse/react-native-hold-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuActionProps {
  children: JSX.Element;
  theme?: 'light' | 'dark';
}

const MenuAction: FC<MenuActionProps> = ({ children, theme }) => {
  const insets = useSafeAreaInsets();
  return (
    <HoldMenuProvider safeAreaInsets={insets} theme={theme}>
      {children}
    </HoldMenuProvider>
  );
};

export { MenuAction as ContextMenuView };
