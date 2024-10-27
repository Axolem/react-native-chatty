import { createContext } from 'react';
import { IChatty } from 'src/types/chatty.types';

export const PropsContext = createContext<IChatty>({} as IChatty);
