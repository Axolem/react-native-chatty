import type { IMessage } from '../types/chatty.types';
import { ContextMenuView } from '../utils/context-menu';

interface IProps {
  message: IMessage;
  children: JSX.Element;
}

function ContextMenuWrapper(props: IProps) {
  return <ContextMenuView>{props.children}</ContextMenuView>;
}

export { ContextMenuWrapper };
