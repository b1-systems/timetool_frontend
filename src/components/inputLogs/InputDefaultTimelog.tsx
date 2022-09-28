import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { TimePicker } from "@mui/x-date-pickers";
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
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { alertShownInInputState } from "../../atom";
import { DefaultTimelog } from "../../models";

export default function InputDefaultTimelog(props: {
  types: string[];
  defaultTimelog: DefaultTimelog;
  setDefaultTimelog(timelog: DefaultTimelog): void;
}) {
  const { t } = useTranslation();
  const setAlertShownInInput = useSetRecoilState(alertShownInInputState);

  const [datePickerFrom, setDatePickerFrom] = useState(
    DateTime.fromSeconds(props.defaultTimelog.start_dt),
  );
  const [datePickerTo, setDatePickerTo] = useState(
    DateTime.fromSeconds(props.defaultTimelog.end_dt),
  );

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
                setDatePickerFrom(
                  newValue.set({
                    year: DateTime.fromSeconds(props.defaultTimelog.start_dt).year,
                    month: DateTime.fromSeconds(props.defaultTimelog.start_dt).month,
                    day: DateTime.fromSeconds(props.defaultTimelog.start_dt).day,
                    second: 0,
                    millisecond: 0,
                  }),
                );
                if (newValue.isValid) {
                  props.setDefaultTimelog({
                    ...props.defaultTimelog,
                    start_dt:
                      newValue
                        .set({
                          year: DateTime.fromSeconds(props.defaultTimelog.start_dt)
                            .year,
                          month: DateTime.fromSeconds(props.defaultTimelog.start_dt)
                            .month,
                          day: DateTime.fromSeconds(props.defaultTimelog.start_dt).day,
                          second: 0,
                          millisecond: 0,
                        })
                        .valueOf() / 1000,
                  });
                }
              }
            }}
            renderInput={(params: any) => <TextField {...params} />}
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
                    year: DateTime.fromSeconds(props.defaultTimelog.start_dt).year,
                    month: DateTime.fromSeconds(props.defaultTimelog.start_dt).month,
                    day: DateTime.fromSeconds(props.defaultTimelog.start_dt).day,
                    second: 0,
                    millisecond: 0,
                  }),
                );
                if (newValue.isValid) {
                  props.setDefaultTimelog({
                    ...props.defaultTimelog,
                    end_dt:
                      newValue
                        .set({
                          year: DateTime.fromSeconds(props.defaultTimelog.start_dt)
                            .year,
                          month: DateTime.fromSeconds(props.defaultTimelog.start_dt)
                            .month,
                          day: DateTime.fromSeconds(props.defaultTimelog.start_dt).day,
                          second: 0,
                          millisecond: 0,
                        })
                        .valueOf() / 1000,
                  });
                }
              }
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("break_time_(minutes)")}
          value={props.defaultTimelog.breaklength / 60}
          onChange={(e) =>
            props.setDefaultTimelog({
              ...props.defaultTimelog,
              breaklength: parseInt(e.target.value) * 60,
            })
          }
          type="number"
          inputProps={{ min: "0", max: "1000" }}
        />
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("travel_time_(minutes)")}
          value={props.defaultTimelog.travel / 60}
          onChange={(e) => {
            props.setDefaultTimelog({
              ...props.defaultTimelog,
              travel: parseInt(e.target.value) * 60,
            });
          }}
          type="number"
          inputProps={{ min: "0" }}
        />
      </Grid>
      <Grid item xs={12} sm={11} md={6} lg={3}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={props.defaultTimelog.comment}
          onChange={(e) =>
            props.setDefaultTimelog({
              ...props.defaultTimelog,
              comment: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12} sm={5} md={3} lg={3}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            value={props.defaultTimelog.onsite}
            onChange={(e) =>
              props.setDefaultTimelog({
                ...props.defaultTimelog,
                onsite: e.target.value,
              })
            }
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
        {props.defaultTimelog.uuid && (
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
        )}
      </Grid>
    </>
  );
}
