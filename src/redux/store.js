import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./feature/leadSlice";

const store = configureStore({
  reducer: {
    leads: leadReducer,
  },
});

export default store;
