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

import { useEditTimelog } from "../../atoms/edit";
import { useProjectPerdiemModels, useSelectedProject } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { submitPerdiem } from "../../lib";
import { Perdiem } from "../../models/internal";
import CancelEditButton from "./CancelEditButton";
import SubmitButtons from "./SubmitButtons";

export default function InputPerdiem(props: { types: string[] }) {
  const { t } = useTranslation();

  const [selectedProject] = useSelectedProject();
  const projectPerdiemModels = useProjectPerdiemModels();

  const [selectedDate] = useSelectedDate();
  const [selectedModel, setSelectedModel] = useState(-1);
  const [comment, setComment] = useState("");

  const editTimelog = useEditTimelog() as Perdiem | null;
  useEffect(() => {
    // if the uuid is changed
    // or editing is cancelled
    // change the input values accordingly
    if (editTimelog) {
      setSelectedModel(editTimelog.type);
      setComment(editTimelog.comment);
    } else {
      // Editing was cancelled, clear inputs
      setSelectedModel(-1);
      setComment("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTimelog?.uuid]);

  // TODO: default to first perdiem model if only one is available

  const submit = () =>
    submitPerdiem({
      startTime: selectedDate,
      comment: comment,
      project_uuid: selectedProject!.uuid,
      type: selectedModel,
      uuid: editTimelog?.uuid,
    });

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
      {editTimelog && <CancelEditButton />}
      {/* Submit Buttons */}
      <SubmitButtons submit={submit} />
    </>
  );
}
