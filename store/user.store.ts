import { IUser } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware"
interface UserState {
  user: IUser|null;
  setUser: (userData: IUser) => void;
  clearUser: ()=> void;
}

export const useUserStore = create<UserState>()(
    persist(
    (set) => ({
  user: null,
  setUser: (user) => set({user}),
  clearUser: () => set({user:null})
}) , 
{
    name: "user"
}
)
);
