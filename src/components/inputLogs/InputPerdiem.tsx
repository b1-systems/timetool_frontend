import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { alertShownInInputState, perdiemModelsState, projectState } from "../../atom";
import { Perdiem, isPerdiem } from "../../models";

export default function InputPerdiem(props: {
  types: string[];
  perdiemTimelog: Perdiem;
  setPerdiemTimelog(timelog: Perdiem): void;
}) {
  const { t } = useTranslation();

  const setAlertShownInInput = useSetRecoilState(alertShownInInputState);
  const project = useRecoilValue(projectState);

  const perdiemModels = useRecoilValue(perdiemModelsState);
  const projectPerdiem = project ? perdiemModels.get(project.uuid) : {};

  if (!props.types.includes("perdiem")) {
    setAlertShownInInput(true);
    return (
      <Container>
        <Box sx={{ mx: "auto", textAlign: "center", p: 5 }}>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("no_perdiems_in_this_project")}
          </Alert>
        </Box>
      </Container>
    );
  }

  setAlertShownInInput(false);

  return (
    <>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-modelState">{t("model")}</InputLabel>
          <Select
            labelId="select-label-model"
            required={true}
            id="demo-simple-select-model"
            value={
              isPerdiem(props.perdiemTimelog)
                ? props.perdiemTimelog.type.toString()
                : "-1"
            }
            label={t("model")}
            onChange={(e) => {
              props.setPerdiemTimelog({
                ...props.perdiemTimelog,
                type: parseInt(e.target.value),
              });
            }}
          >
            {projectPerdiem &&
              Object.entries(projectPerdiem).map(([key, perdiemModel]) => (
                <MenuItem key={key} value={key}>
                  {perdiemModel}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={7} md={6} lg={4}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={props.perdiemTimelog.comment}
          onChange={(e) =>
            props.setPerdiemTimelog({
              ...props.perdiemTimelog,
              comment: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
        {props.perdiemTimelog.uuid && (
          <Button
            color="warning"
            fullWidth
            size="large"
            onClick={() => {
              props.setPerdiemTimelog({ ...props.perdiemTimelog, uuid: null });
            }}
            variant="contained"
            data-testid={`InputPerdiem_cancel_edit-warning-btn`}
            startIcon={<DoDisturbIcon />}
          >
            {t("cancel_edit")}
          </Button>
        )}
      </Grid>
    </>
  );
}
