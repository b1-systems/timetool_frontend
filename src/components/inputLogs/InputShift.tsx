import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
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
import { TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { alertShownInInputState } from "../../atom";
import { useSelectedProject, useShiftModels } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { Shift } from "../../models";

export default function InputShift(props: {
  types: string[];
  shiftTimelog: Shift;
  setShiftTimelog(timelog: Shift): void;
}) {
  const { t } = useTranslation();
  const [selectedProject] = useSelectedProject();
  const shiftModels = useShiftModels();
  const projectShiftModels = selectedProject
    ? shiftModels.get(selectedProject!.uuid)
    : {};

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

  const setAlertShownInInput = useSetRecoilState(alertShownInInputState);

  const addHandler = () => {
    props.setShiftTimelog({
      ...props.shiftTimelog,
      incidents: [
        ...props.shiftTimelog.incidents,
        {
          start_dt: selectedDate.valueOf() / 1000,
          end_dt: selectedDate.valueOf() / 1000,
          comment: "",
        },
      ],
    });
  };

  if (!props.types.includes("shift")) {
    setAlertShownInInput(true);
    return (
      <Container>
        <Box sx={{ mx: "auto", textAlign: "center", p: 5 }}>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("no_shifts_in_this_project")}
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
          <InputLabel id="select-label-shiftModelState">{t("shift_model")}</InputLabel>
          <Select
            labelId="select-label-shiftModel"
            id="demo-simple-select-shiftModel"
            value={props.shiftTimelog.shift_model}
            required={true}
            label={t("shift_model")}
            onChange={(e) => {
              props.setShiftTimelog({
                ...props.shiftTimelog,
                shift_model: e.target.value,
              });
            }}
          >
            {projectShiftModels &&
              Object.entries(projectShiftModels).map(([key, shift]) => (
                <MenuItem key={key} value={key}>
                  {shift}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2} sx={{ mt: 1 }}>
        <Button
          disabled={!props.shiftTimelog.shift_model}
          fullWidth
          size="large"
          onClick={addHandler}
          variant="contained"
          startIcon={<NoteAddIcon />}
        >
          {t("add_entry")}
        </Button>
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2} sx={{ mt: 1 }}>
        {props.shiftTimelog.uuid && (
          <Button
            color="warning"
            fullWidth
            size="large"
            onClick={() => {
              props.setShiftTimelog({ ...props.shiftTimelog, uuid: null });
            }}
            variant="contained"
            data-testid={`InputShift_cancel_edit-warning-btn`}
            startIcon={<DoDisturbIcon />}
          >
            {t("cancel_edit")}
          </Button>
        )}
      </Grid>
      {props.shiftTimelog.incidents.map((incident, index) => (
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
                    props.setShiftTimelog({
                      ...props.shiftTimelog,
                      incidents: [
                        ...props.shiftTimelog.incidents.slice(0, index),
                        {
                          ...incident,
                          start_dt:
                            selectedDate
                              .set({
                                hour: newValue.hour || 0,
                                minute: newValue.minute || 0,
                                second: 0,
                                millisecond: 0,
                              })
                              .valueOf() / 1000,
                        },
                        ...props.shiftTimelog.incidents.slice(index + 1),
                      ],
                    });
                  }
                }}
                renderInput={(params: any) => <TextField {...params} />}
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
                    props.setShiftTimelog({
                      ...props.shiftTimelog,
                      incidents: [
                        ...props.shiftTimelog.incidents.slice(0, index),
                        {
                          ...incident,
                          end_dt:
                            selectedDate
                              .set({
                                hour: newValue.hour || 0,
                                minute: newValue.minute || 0,
                                second: 0,
                                millisecond: 0,
                              })
                              .valueOf() / 1000,
                        },
                        ...props.shiftTimelog.incidents.slice(index + 1),
                      ],
                    });
                  }
                }}
                renderInput={(params: any) => <TextField {...params} />}
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
                props.setShiftTimelog({
                  ...props.shiftTimelog,
                  incidents: [
                    ...props.shiftTimelog.incidents.slice(0, index),
                    {
                      ...incident,
                      comment: e.target.value,
                    },
                    ...props.shiftTimelog.incidents.slice(index + 1),
                  ],
                });
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              sx={{ mt: 1 }}
              color="error"
              variant="contained"
              onClick={() => {
                props.setShiftTimelog({
                  ...props.shiftTimelog,
                  incidents: [
                    ...props.shiftTimelog.incidents.slice(0, index),
                    ...props.shiftTimelog.incidents.slice(index + 1),
                  ],
                });
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
