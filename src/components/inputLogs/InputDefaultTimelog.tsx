import { TimePicker } from "@mui/lab";
import {
  Alert,
  Box,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";

import { alertShownInInputState, dateFromState, dateToState } from "../../atom";

export default function InputDefaultTimelog(props: {
  handleRemote(): void;
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

  console.log("props.types", props.types);

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
                setDatePickerFrom(newValue.set({ second: 0, millisecond: 0 }));
                if (newValue.isValid) {
                  setDateFrom(newValue.set({ second: 0, millisecond: 0 }));
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
            value={dateTo}
            onChange={(newValue) => {
              if (newValue) {
                setDateTo(newValue.set({ second: 0, millisecond: 0 }));
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
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            defaultValue="remote"
            onChange={props.handleRemote}
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
    </>
  );
}
