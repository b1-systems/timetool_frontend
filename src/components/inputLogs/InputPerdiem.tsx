import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useProjectPerdiemModels, useSelectedProject } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { submitPerdiem } from "../../lib";
import SubmitButtons from "./SubmitButtons";

export default function InputPerdiem(props: { types: string[] }) {
  const { t } = useTranslation();

  const [selectedProject] = useSelectedProject();
  const projectPerdiemModels = useProjectPerdiemModels();

  // default to current date
  const [selectedDate, setSelectedDate] = useSelectedDate();
  const [selectedModel, setSelectedModel] = useState(-1);
  const [comment, setComment] = useState("");
  useEffect(
    () => {
      // if the uuid is changed
      // or editing is cancelled
      // change the input values accordingly
    },
    [
      /* editUUID */
    ],
  );

  const submit = ({ advanceDate }: { advanceDate: boolean }) => {
    // Do API call
    submitPerdiem({
      start_dt: selectedDate.toSeconds() | 0,
      comment: comment,
      project_uuid: selectedProject!.uuid,
      type: selectedModel,
      uuid: "",
    });

    if (advanceDate) setSelectedDate((value) => value.plus({ days: 1 }));
  };

  return (
    <>
      {/* Perdiem Model Selection */}
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-modelState">{t("model")}</InputLabel>
          <Select
            labelId="select-label-model"
            required={true}
            id="demo-simple-select-model"
            value={selectedModel === -1 ? "" : selectedModel.toString()}
            label={t("model")}
            onChange={(e) => setSelectedModel(parseInt(e.target.value))}
          >
            {projectPerdiemModels &&
              Object.entries(projectPerdiemModels).map(([key, perdiemModel]) => (
                <MenuItem key={key} value={key}>
                  {perdiemModel}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Comment Input */}
      <Grid item xs={12} sm={7} md={6} lg={4}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Grid>

      {/* Cancel Editing Button */}
      {/* props.perdiemTimelog.uuid && (
        <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
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
        </Grid>
          ) */}

      {/* Submit Buttons */}
      <SubmitButtons submit={submit} />
    </>
  );
}
