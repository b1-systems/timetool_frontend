import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useEditTimelog } from "../../atoms/edit";
import { useProjectShiftModels, useSelectedProject } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { submitShift } from "../../lib";
import { Incident, Shift } from "../../models/internal";
import CancelEditButton from "./CancelEditButton";
import SubmitButtons from "./SubmitButtons";

/**
 * Out of place implemenation of Array.prototype.splice
 * @param array the array to splice
 * @param index the index to start splicing at
 * @param deleteCount the amount of elements to delete starting at index
 * @param insertElements the elements to insert at index after deleteCount elements have been deleted; can be empty
 * @returns a new array with the spliced elements
 */
const spliceOOP = <T extends unknown>(
  array: T[],
  index: number,
  deleteCount: number,
  ...insertElements: T[]
) => array.slice(0, index).concat(insertElements, array.slice(index + deleteCount));

export default function InputShift() {
  const { t } = useTranslation();
  const [selectedProject] = useSelectedProject();
  const projectShiftModels = useProjectShiftModels();
  // default to current date
  const [selectedDate] = useSelectedDate();
  const [selectedModel, setSelectedModel] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const resetInputs = () => {
    setSelectedModel("");
    setIncidents([]);
  };

  const editTimelog = useEditTimelog() as Shift | null;
  useEffect(() => {
    // if the uuid is changed
    // or editing is cancelled
    // change the input values accordingly
    if (editTimelog) {
      setSelectedModel(editTimelog.shiftModel);
      setIncidents(editTimelog.incidents);
    } else {
      // Editing was cancelled, reset inputs
      resetInputs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTimelog?.uuid]);

  // TODO: default to first shift model if only one is available

  const submit = () =>
    submitShift({
      startTime: selectedDate,
      endTime: selectedDate,
      project_uuid: selectedProject!.uuid,
      shiftModel: selectedModel,
      incidents: incidents,
      uuid: editTimelog?.uuid,
    }).then(resetInputs);

  const addHandler = () => {
    setIncidents((currentIncidents) => [
      ...currentIncidents,
      {
        startTime: selectedDate,
        endTime: selectedDate,
        comment: "",
      },
    ]);
  };

  return (
    <>
      {/* Shift Model Selection */}
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-shiftModelState">{t("shift_model")}</InputLabel>
          <Select
            labelId="select-label-model"
            required={true}
            id="demo-simple-select-shiftModel"
            value={selectedModel}
            label={t("shift_model")}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {projectShiftModels &&
              Object.entries(projectShiftModels).map(([key, shiftModel]) => (
                <MenuItem key={key} value={key}>
                  {shiftModel}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Add Entry Button */}
      <Grid item xs={12} sm={4} md={3} lg={2} sx={{ mt: 1 }}>
        <Button
          disabled={!selectedModel}
          fullWidth
          size="large"
          onClick={addHandler}
          variant="contained"
          startIcon={<NoteAddIcon />}
        >
          {t("add_entry")}
        </Button>
      </Grid>

      {/* Entries List */}
      {incidents.map((incident, index) => (
        <Grid container spacing={3} item xs={12} key={index}>
          {/* From Time Picker */}
          <Grid item xs={12} sm={3} md={2} lg={2}>
            <FormControl fullWidth>
              <TimePicker
                label={t("from")}
                value={incident.startTime}
                ampm={false}
                ampmInClock={false}
                minutesStep={5}
                onChange={(newValue) => {
                  if (newValue) {
                    setIncidents((currentIncidents) =>
                      spliceOOP(currentIncidents, index, 1, {
                        ...incident,
                        startTime: DateTime.fromObject({
                          hour: newValue.hour || 0,
                          minute: newValue.minute || 0,
                          second: 0,
                          millisecond: 0,
                        }),
                      }),
                    );
                  }
                }}
                renderInput={(params: any) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>

          {/* To Time Picker */}
          <Grid item xs={12} sm={3} md={2} lg={2}>
            <FormControl fullWidth>
              <TimePicker
                label={t("to")}
                ampm={false}
                ampmInClock={false}
                minutesStep={5}
                value={incident.endTime}
                onChange={(newValue) => {
                  if (newValue) {
                    setIncidents((currentIncidents) =>
                      spliceOOP(currentIncidents, index, 1, {
                        ...incident,
                        endTime: DateTime.fromObject({
                          hour: newValue.hour || 0,
                          minute: newValue.minute || 0,
                          second: 0,
                          millisecond: 0,
                        }),
                      }),
                    );
                  }
                }}
                renderInput={(params: any) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>

          {/* Comment Input */}
          <Grid item xs={10} sm={5} md={3} lg={2}>
            <TextField
              fullWidth
              label={t("comment")}
              required={true}
              value={incident.comment}
              onChange={(e) => {
                setIncidents((currentIncidents) =>
                  spliceOOP(currentIncidents, index, 1, {
                    ...incident,
                    comment: e.target.value,
                  }),
                );
              }}
            />
          </Grid>

          {/* Delete Button */}
          <Grid item xs={1}>
            <Button
              sx={{ mt: 1 }}
              color="error"
              variant="contained"
              onClick={() => {
                setIncidents((currentIncidents) =>
                  spliceOOP(currentIncidents, index, 1),
                );
              }}
            >
              <DeleteIcon />
            </Button>
          </Grid>
        </Grid>
      ))}

      {/* Cancel Editing Button */}
      {editTimelog && <CancelEditButton />}
      {/* Submit Buttons */}
      <SubmitButtons submit={submit} />
    </>
  );
}
