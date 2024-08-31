import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Admin {
  id: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
}

interface AdminState {
  data: Admin;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  data: {
    id: "",
    userId: "",
    name: "",
    email: "",
    mobile: "",
  },
  loading: false,
  error: null,
};

export const fetchAdmin = createAsyncThunk(
  "admin/fetch",
  async (id: string, _thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearAdmin: (state) => {
      state.data = {
        id: "",
        userId: "",
        name: "",
        email: "",
        mobile: "",
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdmin.pending, (state, _action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const { setAdmin, clearAdmin } = AdminSlice.actions;
export default AdminSlice.reducer;
