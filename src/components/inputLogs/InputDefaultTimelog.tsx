import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { TimePicker } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  alertShownInInputState,
  dateFromState,
  dateToState,
  editTimelogState,
  monthState,
} from "../../atom";

export default function InputDefaultTimelog(props: {
  setUuidLog(uuid: string | null): void;
  remote: "remote" | "onsite";
  setRemote(to: "remote" | "onsite"): void;
  setBreakTime(time: number): void;
  breakTime: number;
  setTravelTime(time: number): void;
  travelTime: number;
  setLogMsg(msg: string): void;
  logMsg: string;
  types: string[];
}) {
  const { t } = useTranslation();
  const [dateFrom, setDateFrom] = useRecoilState(dateFromState);
  const setAlertShownInInput = useSetRecoilState(alertShownInInputState);
  const [datePickerFrom, setDatePickerFrom] = useState(dateFrom);
  const [dateTo, setDateTo] = useRecoilState(dateToState);
  const [datePickerTo, setDatePickerTo] = useState(dateTo);
  const [remotePicker, setRemotePicker] = useState(props.remote);

  const month = useRecoilValue(monthState);
  const [editTimelog, setEditTimelog] = useRecoilState(editTimelogState);

  useEffect(() => {
    setDatePickerFrom(dateFrom);
    setDatePickerTo(dateTo);
    setRemotePicker(props.remote);
  }, [dateFrom, dateTo, month, props.remote]);

  if (!props.types.includes("timelog")) {
    setAlertShownInInput(true);
    return (
      <Container>
        <Box sx={{ mx: "auto", textAlign: "center", p: 5 }}>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("no_timelogs_in_this_project")}
          </Alert>
        </Box>
      </Container>
    );
  }
  setAlertShownInInput(false);

  const handleRemote = (str: string) => {
    if (str === "remote") {
      props.setRemote(str);
      setRemotePicker(str);
    } else if (str === "onsite") {
      props.setRemote(str);
      setRemotePicker(str);
    }
  };

  return (
    <>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <FormControl fullWidth>
          <TimePicker
            label={t("from")}
            value={datePickerFrom}
            ampm={false}
            ampmInClock={false}
            onChange={(newValue) => {
              if (newValue) {
                setDatePickerFrom(
                  newValue.set({
                    year: dateFrom.year,
                    month: dateFrom.month,
                    day: dateFrom.day,
                    second: 0,
                    millisecond: 0,
                  }),
                );
                if (newValue.isValid) {
                  setDateFrom(
                    newValue.set({
                      year: dateFrom.year,
                      month: dateFrom.month,
                      day: dateFrom.day,
                      second: 0,
                      millisecond: 0,
                    }),
                  );
                }
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <FormControl fullWidth>
          <TimePicker
            label={t("to")}
            ampm={false}
            ampmInClock={false}
            value={datePickerTo}
            onChange={(newValue) => {
              if (newValue) {
                setDatePickerTo(
                  newValue.set({
                    year: dateTo.year,
                    month: dateTo.month,
                    day: dateTo.day,
                    second: 0,
                    millisecond: 0,
                  }),
                );
                if (newValue.isValid) {
                  setDateTo(
                    newValue.set({
                      year: dateTo.year,
                      month: dateTo.month,
                      day: dateTo.day,
                      second: 0,
                      millisecond: 0,
                    }),
                  );
                }
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("break_time_(minutes)")}
          value={props.breakTime}
          onChange={(e) => props.setBreakTime(parseInt(e.target.value))}
          type="number"
          inputProps={{ min: "0", max: "1000" }}
        />
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("travel_time_(minutes)")}
          value={props.travelTime}
          onChange={(e) => props.setTravelTime(parseInt(e.target.value))}
          type="number"
          inputProps={{ min: "0" }}
        />
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={props.logMsg}
          onChange={(e) => props.setLogMsg(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={5} md={3} lg={3}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            value={remotePicker}
            onChange={(e) => handleRemote(e.target.value)}
          >
            <FormControlLabel
              value="remote"
              control={<Radio />}
              label="remote"
              labelPlacement="start"
            />
            <FormControlLabel
              value="onsite"
              control={<Radio />}
              label="onsite"
              labelPlacement="start"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
        {editTimelog && (
          <Button
            color="warning"
            fullWidth
            size="large"
            onClick={() => {
              setEditTimelog(null);
              props.setRemote("remote");
              props.setBreakTime(0);
              props.setTravelTime(0);
              props.setLogMsg("");
              props.setUuidLog(null);
            }}
            variant="contained"
            data-testid={`InputTimelog_cancel_edit-warning-btn`}
            startIcon={<DoDisturbIcon />}
          >
            {t("cancel_edit")}
          </Button>
        )}
      </Grid>
    </>
  );
}
