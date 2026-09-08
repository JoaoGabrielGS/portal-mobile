import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Pessoa = Record<string, any>;
export type Curso = Record<string, any>;

type UserState = {
  pessoa: Pessoa | null;
  cursos: Curso[];
  cursoSelecionado: Curso | null;
  setPessoa: (pessoa: Pessoa) => void;
  setCursos: (cursos: Curso[]) => void;
  setCursoSelecionado: (curso: Curso) => void;
  clear: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      pessoa: null,
      cursos: [],
      cursoSelecionado: null,
      setPessoa: (pessoa) => set({ pessoa }),
      setCursos: (cursos) => set({ cursos }),
      setCursoSelecionado: (curso) => set({ cursoSelecionado: curso }),
      clear: () => set({ pessoa: null, cursos: [], cursoSelecionado: null }),
    }),
    {
      name: 'user_store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
