import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Slicers/authSlice";
import taskReducer from "../Slicers/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings in task payloads
        ignoredPaths: ["tasks.tasks"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
