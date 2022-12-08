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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useEditTimelog } from "../../atoms/edit";
import { useSelectedProject } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { submitDefaultTimelog } from "../../lib";
import { DefaultTimelog } from "../../models/internal";
import CancelEditButton from "./CancelEditButton";
import SubmitButtons from "./SubmitButtons";

export default function InputDefaultTimelog(props: { types: string[] }) {
  const { t } = useTranslation();

  const [selectedProject] = useSelectedProject();

  const [selectedDate] = useSelectedDate();
  const [selectedStartTime, setSelectedStartTime] = useState(selectedDate);
  const [selectedEndTime, setSelectedEndTime] = useState(selectedDate);
  const [breakTime, setBreakTime] = useState(Duration.fromMillis(0));
  const [travelTime, setTravelTime] = useState(Duration.fromMillis(0));
  const [site, setSite] = useState("remote");
  const [comment, setComment] = useState("");

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
      // Editing was cancelled, clear inputs
      setSelectedStartTime(selectedDate);
      setSelectedEndTime(selectedDate);
      setBreakTime(Duration.fromMillis(0));
      setTravelTime(Duration.fromMillis(0));
      setSite("remote");
      setComment("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTimelog?.uuid]);

  // TODO: adjust selected start and end time when selected date changes

  const submit = () =>
    submitDefaultTimelog({
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      breakTime,
      travelTime,
      site,
      comment: comment,
      project_uuid: selectedProject!.uuid,
      uuid: editTimelog?.uuid,
    });

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
                setSelectedStartTime(
                  newValue.set({
                    year: selectedDate.year,
                    month: selectedDate.month,
                    day: selectedDate.day,
                    second: 0,
                    millisecond: 0,
                  }),
                );
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
                setSelectedEndTime(
                  newValue.set({
                    year: selectedDate.year,
                    month: selectedDate.month,
                    day: selectedDate.day,
                    second: 0,
                    millisecond: 0,
                  }),
                );
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
