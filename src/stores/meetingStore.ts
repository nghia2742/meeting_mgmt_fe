import { create } from 'zustand';

type Store = {
    isOpenAddForm: boolean;
    setIsOpenForm: () => void;
    isOpenEditForm: boolean;
    setIsOpenEditForm: () => void;
};

export const useMeetingStore = create<Store>()((set) => ({
    isOpenAddForm: false,
    isOpenEditForm: false,
    setIsOpenForm: () =>
        set((state) => ({ isOpenAddForm: !state.isOpenAddForm })),
    setIsOpenEditForm: () =>
        set((state) => ({ isOpenEditForm: !state.isOpenEditForm })),
}));
