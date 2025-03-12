import { useState } from "react";
import { Box } from "@mui/material";
import MuiDataGrid from "../components/MuiDataGrid";
import { useGetTasksQuery } from "../redux/features/apiSlice";
import { TaskColumns } from "../utils/Columns";
import { useSelector } from "react-redux";

const Reports = () => {
  const { selectedDepartment } = useSelector((state) => state.auth);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI Data Grid is zero-based (0 = first page)
    pageSize: 10, // Default rows per page
  });

  const {
    data = {},
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetTasksQuery({
    selectedDepartment,
    page: paginationModel.page + 1, // API is typically 1-based
    limit: paginationModel.pageSize,
  });

  const { tasks = [], pagination = { totalTasks: 0 } } = data;

  if (isError) return <div>{error.data.message || "An error occurred"}</div>;

  return (
    <Box maxWidth="100%" sx={{ display: "flex", flexDirection: "column" }}>
      <MuiDataGrid
        rows={tasks || []}
        col={TaskColumns}
        slug="tasks"
        loading={isFetching || isLoading}
        rowCount={pagination.totalTasks} // Total number of records
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel} // Handles page change
      />
    </Box>
  );
};

export default Reports;
