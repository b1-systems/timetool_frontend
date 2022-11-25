import { DoDisturb } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useEditUUID } from "../../atoms/edit";

const CancelEditButton = () => {
  const { t } = useTranslation();
  const [editUUID, setEditUUID] = useEditUUID();

  // TODO: debounce buttons

  return (
    <>
      <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
        <Button
          color="warning"
          fullWidth
          size="large"
          onClick={() => setEditUUID(null)}
          disabled={!editUUID}
          variant="contained"
          data-testid={`InputPerdiem_cancel_edit-warning-btn`}
          startIcon={<DoDisturb />}
        >
          {t("cancel_edit")}
        </Button>
      </Grid>
    </>
  );
};
export default CancelEditButton;
