import { Schema, Threat } from "@/utils/interfaces";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Parameter {
  name: string;
  in: string;
  required: boolean;
  schemaRef: {
    type: string;
    title: string;
  };
}

export interface Endpoint {
  _id: string;
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  summary: string;
  operationId: string;
  enabled: boolean;
  organization: any;
  parameters: Parameter[];
  requestBody: {
    content: {
      "application/json": {
        schemaRef: Schema;
      };
    };
    required: boolean;
  };
  responses: Map<
    string,
    {
      description: string;
      content: {
        "application/json": {
          schemaRef: Schema;
        };
      };
    }
  >;
  threats: Threat[];
  createdAt: string;
  updatedAt: string;
}

interface EndpointState {
  data: Endpoint[];
  loading: boolean;
  error: string | null;
}

const initialState: EndpointState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchEndpoints = createAsyncThunk(
  "endpoint/fetch",
  async (payload: { organization: string }, _thunkAPI) => {
    try {
      const { organization } = payload;
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/endpoints?organization=${organization}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateEndpoint = createAsyncThunk(
  "endpoint/update",
  async (payload: { endpointId: string; data: any }, _thunkAPI) => {
    try {
      const { endpointId, data } = payload;
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/endpoints/${endpointId}`,
        data
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const EndpointSlice = createSlice({
  name: "endpoints",
  initialState,
  reducers: {
    setEndpoints: (state, action: PayloadAction<Endpoint[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearEndpoints: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEndpoints.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEndpoints.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchEndpoints.rejected, (state, action) => {
      state.error = action.error.message || "An error occurred";
      state.loading = false;
    });
    builder.addCase(updateEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEndpoint.fulfilled, (state, _action) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateEndpoint.rejected, (state, action) => {
      state.error = action.error.message || "An error occurred";
      state.loading = false;
    });
  },
});

export const { setEndpoints, clearEndpoints } = EndpointSlice.actions;
export default EndpointSlice.reducer;
