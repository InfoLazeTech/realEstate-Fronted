import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosconfig.js";
export const fetchLeads = createAsyncThunk(
    "leads/fetchLeads",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const hasFilters = Object.entries(filters).some(([key, val]) => {
                if (val === undefined || val === null || val === "") return false;
                if (typeof val === "string") return val.trim() !== "";
                return true; // numbers/booleans count as filters
            });

            const query = new URLSearchParams(filters).toString();

            const endpoint = hasFilters ? `/leads/search?${query}` : "/leads";
            const res = await axios.get(endpoint);

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
// Create a new lead
export const createLead = createAsyncThunk(
    "leads/create",
    async (lead, { rejectWithValue }) => {
        try {
            const response = await axios.post("/leads", lead);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || "Failed to create lead"
            );
        }
    }
);

// Delete a lead
export const deleteLead = createAsyncThunk(
    "leads/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/leads/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || "Failed to delete lead"
            );
        }
    }
);
export const updateLead = createAsyncThunk("leads/update",
    async ({ id, lead }, { rejectWithValue }) => {
        try {
            const { _id, notes, reminders, ...leadData } = lead;
            const response = await axios.put(`/leads/${id}`, leadData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    })

export const addReminder = createAsyncThunk(
    "leads/addReminder",
    async ({ id, reminder }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/leads/reminder/${id}`, reminder);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
export const getSingleLead = createAsyncThunk(
    "leads/getSingle",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/leads/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


// ✅ Slice
const leadSlice = createSlice({
    name: "leads",
    initialState: {
        items: [],
        loading: false,
        error: null,
        total: 0,
        page: 1,
        pages: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Leads
            .addCase(fetchLeads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;

                // Case 1: Array response
                if (Array.isArray(data)) {
                    state.items = data;
                    state.total = data.length;
                    state.page = 1;
                    state.pages = 1;
                    return;
                }

                // Case 2: Object response
                state.items = data.leads || data.docs || data.data || [];
                state.total = data.total || state.items.length;
                state.page = data.page || 1;
                state.pages = data.pages || 1;
            })


            .addCase(fetchLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Lead
            .addCase(createLead.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(createLead.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete Lead
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.items = state.items.filter((l) => l._id !== action.payload);
            })
            .addCase(deleteLead.rejected, (state, action) => {
                state.error = action.payload;
            })
            //add reminder
            .addCase(addReminder.fulfilled, (state, action) => {
                const updated = action.payload;
                state.items = state.items.map((lead) =>
                    lead._id === updated._id ? updated : lead
                );
            })
            .addCase(addReminder.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update Lead
            .addCase(updateLead.fulfilled, (state, action) => {
                const updated = action.payload;
                state.items = state.items.map((lead) =>
                    lead._id === updated._id ? updated : lead
                );
            })
            .addCase(updateLead.rejected, (state, action) => {
                state.error = action.payload;
            })

    },
});

export default leadSlice.reducer;
