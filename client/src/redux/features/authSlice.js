import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  departments: [],
  selectedDepartment: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      // Expecting action.payload to have: { currentUser, departments, selectedDepartment }
      const { currentUser, departments, selectedDepartment } = action.payload;
      state.currentUser = currentUser;
      state.departments = departments || [];
      // Default to the provided selectedDepartment or fallback to the user's own department ID (if exists)
      state.selectedDepartment = selectedDepartment || currentUser?.department?._id || null;
    },
    setSelectedDepartment(state, action) {
      state.selectedDepartment = action.payload;
    },
    logout(state) {
      state.currentUser = null;
      state.departments = [];
      state.selectedDepartment = null;
    },
  },
});

export const { setCurrentUser, setSelectedDepartment, logout } = authSlice.actions;
export default authSlice.reducer;
