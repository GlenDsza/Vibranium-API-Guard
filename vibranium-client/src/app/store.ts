import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AdminSlice } from "./features/AdminSlice";
import { TeamSlice } from "./features/TeamSlice";
import { EndpointSlice } from "./features/EndpointSlice";
import { NotificationSlice } from "./features/NotificationSlice";

export const store = configureStore({
  reducer: {
    admin: AdminSlice.reducer,
    team: TeamSlice.reducer,
    endpoints: EndpointSlice.reducer,
    notifications: NotificationSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
