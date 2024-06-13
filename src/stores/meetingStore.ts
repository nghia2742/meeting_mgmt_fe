import { create } from 'zustand';

type Store = {
    isOpenAddForm: boolean;
    setIsOpenForm: () => void;
};

export const useMeetingStore = create<Store>()((set) => ({
    isOpenAddForm: false,
    setIsOpenForm: () =>
        set((state) => ({ isOpenAddForm: !state.isOpenAddForm })),
}));
