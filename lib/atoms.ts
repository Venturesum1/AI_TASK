import { atom } from 'jotai';

interface User {
  id: number;
  email: string;
}

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);