import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { TimePicker } from "@mui/lab";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { dateFromState, editTimelogState, shiftModelsState } from "../../atom";
import { Incident, ShiftModelsToProjectUuid } from "../../models";

export default function InputShift(props: {
  uuidProject: string;
  projectShiftModelsAsObject: ShiftModelsToProjectUuid;
  shiftModels: string[];
  shift: string;
  setUuidLog(uuid: string | null): void;
  setShift(shiftModel: string): void;
  incidents: Incident[];
  setIncidents(Incidents: Incident[]): void;
  setShiftModel(model: string): void;
}) {
  const { t } = useTranslation();

  const [shiftSelected, setShiftSelected] = useState(props.shift);
  const shiftModels = useRecoilValue(shiftModelsState);
  const [editShift, setEditShift] = useRecoilState(editTimelogState);
  const [dateFrom] = useRecoilState(dateFromState);

  const addHandler = () => {
    props.setIncidents([
      ...props.incidents,
      {
        start_dt: dateFrom.valueOf() / 1000,
        end_dt: dateFrom.valueOf() / 1000,
        comment: "",
      },
    ]);
  };

  const shiftModel = shiftModels.get(props.uuidProject);
  if (!shiftModel) {
    return <p>No Shifts</p>;
  }

  return (
    <>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-shiftModelState">{t("shift_model")}</InputLabel>
          <Select
            labelId="select-label-shiftModel"
            id="demo-simple-select-shiftModel"
            value={shiftSelected}
            required={true}
            label={t("shift_model")}
            onChange={(e) => {
              props.setShiftModel(e.target.value);
              setShiftSelected(e.target.value);
            }}
          >
            {Object.entries(shiftModel).map(([key, shift]) => (
              <MenuItem key={key} value={key}>
                {shift}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
        <Button
          disabled={!shiftSelected}
          fullWidth
          size="large"
          onClick={addHandler}
          variant="contained"
          startIcon={<NoteAddIcon />}
        >
          {t("add_entry")}
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
        {editShift.project_uuid !== "-1" && editShift.start_dt !== -1 && (
          <Button
            color="warning"
            fullWidth
            size="large"
            onClick={() => {
              setEditShift({
                uuid: "-1",
                employee_uuid: "-1",
                project_uuid: "-1",
                project_name: "-1",
                start_dt: -1,
                end_dt: -1,
                type: "-1",
              });
              setShiftSelected("");
              props.setShift("");
              props.setShiftModel("");
              props.setUuidLog(null);
              props.setIncidents([]);
            }}
            variant="contained"
            startIcon={<DoDisturbIcon />}
          >
            {t("cancel_edit")}
          </Button>
        )}
      </Grid>
      {props.incidents.map((incident, index) => (
        <Grid container spacing={3} item xs={12} key={index}>
          <Grid item xs={12} sm={3} md={2} lg={2}>
            <FormControl fullWidth>
              <TimePicker
                label={t("from")}
                value={DateTime.fromSeconds(incident.start_dt)}
                ampm={false}
                ampmInClock={false}
                onChange={(newValue) => {
                  if (newValue) {
                    props.setIncidents([
                      ...props.incidents.slice(0, index),
                      {
                        ...incident,
                        start_dt:
                          dateFrom
                            .set({
                              hour: newValue.hour || 0,
                              minute: newValue.minute || 0,
                              second: 0,
                              millisecond: 0,
                            })
                            .valueOf() / 1000,
                      },
                      ...props.incidents.slice(index + 1),
                    ]);
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} md={2} lg={2}>
            <FormControl fullWidth>
              <TimePicker
                label={t("to")}
                ampm={false}
                ampmInClock={false}
                value={DateTime.fromSeconds(incident.end_dt)}
                onChange={(newValue) => {
                  if (newValue) {
                    props.setIncidents([
                      ...props.incidents.slice(0, index),
                      {
                        ...incident,
                        end_dt:
                          dateFrom
                            .set({
                              hour: newValue.hour || 0,
                              minute: newValue.minute || 0,
                              second: 0,
                              millisecond: 0,
                            })
                            .valueOf() / 1000,
                      },
                      ...props.incidents.slice(index + 1),
                    ]);
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={10} sm={5} md={3} lg={2}>
            <TextField
              fullWidth
              label={t("comment")}
              required={true}
              value={incident.comment}
              onChange={(e) => {
                props.setIncidents([
                  ...props.incidents.slice(0, index),
                  {
                    ...incident,
                    comment: e.target.value,
                  },
                  ...props.incidents.slice(index + 1),
                ]);
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              sx={{ mt: 1 }}
              color="error"
              variant="contained"
              onClick={() => {
                props.setIncidents([
                  ...props.incidents.slice(0, index),
                  ...props.incidents.slice(index + 1),
                ]);
              }}
            >
              <DeleteIcon />
            </Button>
          </Grid>
        </Grid>
      ))}
    </>
  );
}
