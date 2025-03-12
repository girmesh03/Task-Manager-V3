import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CustomDataGridToolbar from "./CustomDataGridToolbar";

import {
  useDeleteTaskMutation,
  useDeleteUserMutation,
} from "../redux/features/apiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const MuiDataGrid = ({
  rows,
  col,
  slug,
  loading,
  rowCount = 0,
  paginationModel,
  onPaginationModelChange,
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handlePageSizeChange = (newPageSize) => {
    onPaginationModelChange({
      ...paginationModel,
      pageSize: newPageSize, // Update page size
    });
  };

  const handleDeleteItem = async (itemId) => {
    try {
      slug === "tasks" && (await deleteTask(itemId).unwrap());
      slug === "users" && (await deleteUser(itemId).unwrap());
      toast.success(
        `${
          slug === "tasks"
            ? "Task deleted successfully"
            : "User deleted successfully"
        }`
      );
    } catch (error) {
      toast.error(error.data.message || "An error occurred");
    }
  };

  const actionColumns = {
    field: "actions",
    headerName: "Actions",
    flex: "auto",
    minWidth: currentUser.role === "admin" ? 150 : 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <>
        <Tooltip title={`View ${slug === "tasks" ? "task" : "user"}`} arrow>
          <IconButton
            size="small"
            component={Link}
            to={`/${slug}/${params.row._id}/details`}
            sx={{ border: "none", color: "primary.main" }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        {currentUser.role === "admin" && (
          <>
            <Tooltip
              title={`Update ${slug === "tasks" ? "task" : "user"}`}
              arrow
            >
              <IconButton
                size="small"
                component={Link}
                to={`/${slug}/${params.row._id}/update`}
                sx={{ border: "none", color: "secondary.main", mx: 0.5 }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={`Delete ${slug === "tasks" ? "task" : "user"}`}
              arrow
            >
              <IconButton
                size="small"
                onClick={() => handleDeleteItem(params.row._id)}
                sx={{ border: "none", color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {slug === "tasks" ? "Tasks" : "Users"}
      </Typography>
      <DataGrid
        checkboxSelection
        disableRowSelectionOnClick
        loading={loading}
        rows={rows}
        columns={[...col, actionColumns]}
        getRowId={(row) => row._id}
        // getRowHeight={() => "auto"}
        paginationMode="server" // Enable server-side pagination
        rowCount={rowCount} // Total count of items from API
        pageSize={paginationModel?.pageSize || rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        onPageSizeChange={handlePageSizeChange} // Handle rows per page change
        pageSizeOptions={[10, 25, 50, 100]}
        onRowSelectionModelChange={(newSelectionModel) =>
          setSelectedItemIds(newSelectionModel)
        }
        selectionModel={selectedItemIds}
        disableColumnResize
        density="compact"
        slots={{
          toolbar: () => (
            <CustomDataGridToolbar
              items={rows}
              selectedItemIds={selectedItemIds}
              slug={slug}
            />
          ),
        }}
      />
    </React.Fragment>
  );
};

MuiDataGrid.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  col: PropTypes.arrayOf(PropTypes.object),
  slug: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  paginationModel: PropTypes.object,
  rowCount: PropTypes.number,
  onPaginationModelChange: PropTypes.func,
};

export default MuiDataGrid;
