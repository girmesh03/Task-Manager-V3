import PropTypes from "prop-types";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";

import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import generateReport from "../utils/generateReport";

const CustomToolbar = ({ items, selectedItemIds, slug }) => {
  const isExportDisabled = selectedItemIds.length === 0;

  return (
    <GridToolbarContainer
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      {slug === "tasks" && (
        <Button
          variant="text"
          size="small"
          disabled={isExportDisabled}
          onClick={() => generateReport(items, selectedItemIds)}
          startIcon={<DownloadIcon />}
        >
          Export As PDF
        </Button>
      )}
    </GridToolbarContainer>
  );
};

CustomToolbar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItemIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  slug: PropTypes.oneOf(["tasks", "users"]).isRequired,
};

export default CustomToolbar;
