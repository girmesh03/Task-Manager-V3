import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const defaultDate =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");

const initialState = {
  searchText: "",
  selectedDate: defaultDate,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    clearFilters(state) {
      state.searchText = "";
      state.selectedDate = defaultDate;
    },
  },
});

export const { setSearchText, setSelectedDate, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
