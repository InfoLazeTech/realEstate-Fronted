import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosconfig.js";

// Fetch leads (filtered OR all)
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const hasFilters = Object.entries(filters).some(([key, val]) => {
        if (val === undefined || val === null || val === "") return false;
        if (typeof val === "string") return val.trim() !== "";
        return true;
      });

      const query = new URLSearchParams(filters).toString();
      const endpoint = hasFilters ? `/leads/search?${query}` : "/leads";
      const res = await axios.get(endpoint);

      return { data: res.data, hasFilters };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createLead = createAsyncThunk("leads/create", async (lead, { rejectWithValue }) => {
  try {
    const response = await axios.post("/leads", lead);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to create lead");
  }
});

export const deleteLead = createAsyncThunk("leads/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/leads/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to delete lead");
  }
});

export const updateLead = createAsyncThunk("leads/update", async ({ id, lead }, { rejectWithValue }) => {
  try {
    const { _id, notes, reminders, ...leadData } = lead;
    const response = await axios.put(`/leads/${id}`, leadData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addReminder = createAsyncThunk("leads/addReminder", async ({ id, reminder }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/leads/reminder/${id}`, reminder);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const editReminder = createAsyncThunk("leads/editReminder", async ({ leadId, reminderId, reminder }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/leads/reminder/${leadId}/${reminderId}`, reminder);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const deleteReminder = createAsyncThunk("leads/deleteReminder", async ({ leadId, reminderId }, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/leads/reminder/${leadId}/${reminderId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

// NOTES
export const editNote = createAsyncThunk("leads/editNote", async ({ leadId, noteId, note }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/leads/note/${leadId}/${noteId}`, note);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const deleteNote = createAsyncThunk("leads/deleteNote", async ({ leadId, noteId }, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/leads/note/${leadId}/${noteId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const getSingleLead = createAsyncThunk("leads/getSingle", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/leads/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    items: [], // filtered / paginated list
    allItems: [], // always keep full leads list
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
        const { data, hasFilters } = action.payload;

        let list = Array.isArray(data)
          ? data
          : data.leads || data.docs || data.data || [];

        state.items = list;
        state.total = data.total || list.length;
        state.page = data.page || 1;
        state.pages = data.pages || 1;

        // Only update allItems if NO filters (pure fetch)
        if (!hasFilters) {
          state.allItems = list;
        }
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.allItems.push(action.payload);
      })

      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l._id !== action.payload);
        state.allItems = state.allItems.filter((l) => l._id !== action.payload);
      })

      // Update Lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((lead) => (lead._id === updated._id ? updated : lead));
        state.allItems = state.allItems.map((lead) => (lead._id === updated._id ? updated : lead));
      })

      // Reminder CRUD (same update for items + allItems)
      .addCase(addReminder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((lead) => (lead._id === updated._id ? updated : lead));
        state.allItems = state.allItems.map((lead) => (lead._id === updated._id ? updated : lead));
      })
      .addCase(editReminder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((lead) => (lead._id === updated._id ? updated : lead));
        state.allItems = state.allItems.map((lead) => (lead._id === updated._id ? updated : lead));
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((lead) => (lead._id === updated._id ? updated : lead));
        state.allItems = state.allItems.map((lead) => (lead._id === updated._id ? updated : lead));
      })

      // Notes update both lists
      .addCase(editNote.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((lead) => (lead._id === updated._id ? updated : lead));
        state.allItems = state.allItems.map((lead) => (lead._id === updated._id ? updated : lead));
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((lead) => (lead._id === updated._id ? updated : lead));
        state.allItems = state.allItems.map((lead) => (lead._id === updated._id ? updated : lead));
      });
  },
});

export default leadSlice.reducer;
