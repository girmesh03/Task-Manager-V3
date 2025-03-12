import { Box } from "@mui/material";

import MuiDataGrid from "../components/MuiDataGrid";
import { useGetLeaderboardQuery } from "../redux/features/apiSlice";
import { UserColumns } from "../utils/Columns";
import { useSelector } from "react-redux";
// import { LoadingFallback } from "../components/LoadingFallback";

const Team = () => {
  const { selectedDepartment } = useSelector((state) => state.auth);
  const { selectedDate } = useSelector((state) => state.filters);

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetLeaderboardQuery({
    selectedDepartment,
    currentDate: selectedDate
      ? selectedDate
      : new Date().toISOString().split("T")[0],
  });

  // if (isLoading) return <LoadingFallback />;
  if (isError) return <div>{error.data.message || "An error occurred"}</div>;

  return (
    <Box maxWidth="100%" sx={{ display: "flex", flexDirection: "column" }}>
      <MuiDataGrid
        rows={data}
        col={UserColumns}
        slug="users"
        loading={isFetching || isLoading}
      />
    </Box>
  );
};

export default Team;
