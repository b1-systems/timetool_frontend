import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DateTime, Duration } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useEditTimelog } from "../../atoms/edit";
import { useSelectedProject } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { submitDefaultTimelog } from "../../lib";
import { DefaultTimelog } from "../../models/internal";
import { combineDateTime, maxTime, roundMinutes } from "../../utils/DateUtils";
import CancelEditButton from "./CancelEditButton";
import SubmitButtons from "./SubmitButtons";

export default function InputDefaultTimelog() {
  const { t } = useTranslation();

  const [selectedProject] = useSelectedProject();

  const [selectedDate] = useSelectedDate();

  const eightAM = selectedDate.set({ hour: 8, minute: 0 });
  const [selectedStartTime, setSelectedStartTime] = useState(eightAM);
  const [selectedEndTime, setSelectedEndTime] = useState(
    maxTime(roundMinutes(DateTime.now(), 30), eightAM),
  );
  const [breakTime, setBreakTime] = useState(Duration.fromMillis(0));
  const [travelTime, setTravelTime] = useState(Duration.fromMillis(0));
  const [site, setSite] = useState("remote");
  const [comment, setComment] = useState("");

  const resetInputs = useCallback(() => {
    const eightAM = selectedDate.set({ hour: 8, minute: 0 });
    setSelectedStartTime(eightAM);
    setSelectedEndTime(maxTime(roundMinutes(DateTime.now(), 30), eightAM));
    setBreakTime(Duration.fromMillis(0));
    setTravelTime(Duration.fromMillis(0));
    setSite("remote");
    setComment("");
  }, [selectedDate]);

  const editTimelog = useEditTimelog() as DefaultTimelog | null;
  useEffect(() => {
    // if the uuid is changed
    // or editing is cancelled
    // change the input values accordingly
    if (editTimelog) {
      setSelectedStartTime(editTimelog.startTime);
      setSelectedEndTime(editTimelog.endTime);
      setBreakTime(editTimelog.breakTime);
      setTravelTime(editTimelog.travelTime);
      setSite(editTimelog.site);
      setComment(editTimelog.comment);
    } else {
      // Editing was cancelled, reset inputs
      resetInputs();
    }

    // disabling exhaustive-deps since working around it is more trouble than it's worth
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTimelog?.uuid]);

  const submit = () =>
    submitDefaultTimelog({
      // set the year, month and day to the selected date
      // this is so we don't have to recalculate the times every time the date changes
      startTime: combineDateTime(selectedDate, selectedStartTime),
      endTime: combineDateTime(selectedDate, selectedEndTime),
      breakTime,
      travelTime,
      site,
      comment: comment,
      project_uuid: selectedProject!.uuid,
      uuid: editTimelog?.uuid,
    }).then(resetInputs);

  return (
    <>
      {/* Start Time Picker */}
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <FormControl fullWidth>
          <TimePicker
            label={t("from")}
            value={selectedStartTime}
            ampm={false}
            ampmInClock={false}
            minutesStep={5}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedStartTime(newValue);
              }
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </FormControl>
      </Grid>

      {/* End Time Picker */}
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <FormControl fullWidth>
          <TimePicker
            label={t("to")}
            ampm={false}
            ampmInClock={false}
            minutesStep={5}
            value={selectedEndTime}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedEndTime(newValue);
              }
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </FormControl>
      </Grid>

      {/* Break Time Input */}
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("break_time_(minutes)")}
          value={breakTime.as("minutes")}
          onChange={(e) =>
            setBreakTime(Duration.fromObject({ minutes: parseInt(e.target.value) }))
          }
          type="number"
          inputProps={{ min: "0", max: "1000" }}
        />
      </Grid>

      {/* Travel Time Input */}
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("travel_time_(minutes)")}
          value={travelTime.as("minutes")}
          onChange={(e) =>
            setTravelTime(Duration.fromObject({ minutes: parseInt(e.target.value) }))
          }
          type="number"
          inputProps={{ min: "0" }}
        />
      </Grid>

      {/* Comment Input */}
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Grid>

      {/* Site Input */}
      <Grid item xs={12} sm={5} md={3} lg={3}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            value={site}
            onChange={(e) => setSite(e.target.value)}
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

      {/* Cancel Editing Button */}
      {editTimelog && <CancelEditButton />}
      {/* Submit Buttons */}
      <SubmitButtons submit={submit} />
    </>
  );
}
