import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSelectedProject } from "../../atoms/projects";
import { useSelectedDate } from "../../atoms/selectedDate";
import { submitDefaultTimelog } from "../../lib";
import SubmitButtons from "./SubmitButtons";

export default function InputDefaultTimelog(props: { types: string[] }) {
  const { t } = useTranslation();

  const [selectedProject] = useSelectedProject();

  // default to current date
  const [selectedDate, setSelectedDate] = useSelectedDate();
  const [selectedStartTime, setSelectedStartTime] = useState(selectedDate);
  const [selectedEndTime, setSelectedEndTime] = useState(selectedDate);
  const [breakTime, setBreakTime] = useState(0);
  const [travelTime, setTravelTime] = useState(0);
  const [site, setSite] = useState("remote");
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
    submitDefaultTimelog({
      start_dt: selectedStartTime.toSeconds() | 0,
      end_dt: selectedEndTime.toSeconds() | 0,
      breakTime,
      travelTime,
      onsite: site,
      comment: comment,
      project_uuid: selectedProject!.uuid,
      uuid: "",
    });

    if (advanceDate) setSelectedDate((value) => value.plus({ days: 1 }));
  };

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
          value={breakTime}
          onChange={(e) => setBreakTime(parseInt(e.target.value))}
          type="number"
          inputProps={{ min: "0", max: "1000" }}
        />
      </Grid>

      {/* Travel Time Input */}
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("travel_time_(minutes)")}
          value={travelTime}
          onChange={(e) => setTravelTime(parseInt(e.target.value))}
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
      {/*props.defaultTimelog.uuid && (
        <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
          <Button
            color="warning"
            fullWidth
            size="large"
            onClick={() => {
              props.setDefaultTimelog({
                ...props.defaultTimelog,
                uuid: null,
              });
            }}
            variant="contained"
            data-testid={`InputTimelog_cancel_edit-warning-btn`}
            startIcon={<DoDisturbIcon />}
          >
            {t("cancel_edit")}
          </Button>
        </Grid>
          )*/}

      {/* Submit Buttons */}
      <SubmitButtons submit={submit} />
    </>
  );
}
