import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
}

interface TeamState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchTeam = createAsyncThunk(
  "team/fetch",
  async (payload: { organization: string }, _thunkAPI) => {
    const { organization } = payload;
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/users?organization=${organization}`
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const TeamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearTeam: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTeam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTeam.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchTeam.rejected, (state, action) => {
      state.error = action.error.message || "An error occurred";
      state.loading = false;
    });
  },
});

export const { setTeam, clearTeam } = TeamSlice.actions;
export default TeamSlice.reducer;
