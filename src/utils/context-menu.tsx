import { FC, useContext } from 'react';
import { HoldItem } from '@manse/react-native-hold-menu';
import { PropsContext } from '../components/props-context';

interface MenuActionProps {
  children: JSX.Element;
  theme?: 'light' | 'dark';
}

const MenuAction: FC<MenuActionProps> = ({ children }) => {
  const props = useContext(PropsContext);
  return <HoldItem {...props.holdMenuProps.holdItemProps}>{children}</HoldItem>;
};

export { MenuAction as ContextMenuView };
