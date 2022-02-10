import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DatePicker from "@mui/lab/DatePicker";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DateTime } from "luxon";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  alertShownInInputState,
  dateFromState,
  dateToState,
  editTimelogState,
  isMonthClosedState,
  projectState,
  projectTypesState,
  useUpdateLogs,
} from "../../atom";
import { handleSubmit } from "../../lib";
import { Timelog, isPerdiem, isShift, isTimelog } from "../../models";
import InputDefaultTimelog from "./InputDefaultTimelog";
import InputPerdiem from "./InputPerdiem";
import Inputshift from "./InputShift";

export default function InputCard(props: { monthIsClosed: boolean }) {
  const { t } = useTranslation();
  const [model] = useState<string>("wasBinichMODELsetMODEL");
  const [type, setType] = useState<string>("");
  const [dateFrom, setDateFrom] = useRecoilState(dateFromState);
  const [dateTo, setDateTo] = useRecoilState(dateToState);
  const [shift] = useState<string>("wasBinichMODELset#Shift");

  const projectTypes = useRecoilValue(projectTypesState);

  const project = useRecoilValue(projectState);

  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [autoNextDay, setAutoNextDay] = useState<boolean>(true);

  const updateLogs = useUpdateLogs();
  const isMonthClosed = useRecoilValue(isMonthClosedState);
  const alertShownInInput = useRecoilValue(alertShownInInputState);
  const [timelog, setTimelog] = useRecoilState<Timelog | null>(editTimelogState);

  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value);
    switch (event.target.value) {
      case "timelog":
        setTimelog({
          uuid: null,
          employee_uuid: null,
          project_name: project?.name || "unknown",
          project_uuid: project?.uuid || "unknown",
          start_dt: dateFrom.valueOf() / 1000,
          end_dt: dateTo.valueOf() / 1000,
          type: "timelog",
          breaklength: 0,
          travel: 0,
          comment: "",
          onsite: "remote",
        });
        break;
      case "perdiem":
        setTimelog({
          uuid: null,
          employee_uuid: null,
          project_name: project?.name || "unknown",
          project_uuid: project?.uuid || "unknown",
          start_dt: dateFrom.valueOf() / 1000,
          type: parseInt(model),
          comment: "",
        });
        break;
      case "shift":
        setTimelog({
          uuid: null,
          employee_uuid: null,
          project_name: project?.name || "unknown",
          project_uuid: project?.uuid || "unknown",
          start_dt: dateFrom.valueOf() / 1000,
          end_dt: dateTo.valueOf() / 1000,
          type: "shift",
          incidents: [],
          shift_model: shift,
        });
        break;
    }
  };

  const handleCommit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnDisabled(false);
    }, 1000);
    if (timelog) {
      await handleSubmit(timelog).then(() => {
        if (autoNextDay) {
          setDateFrom((dateFrom) => dateFrom.plus({ days: 1 }));
          setDateTo((dateTo) => dateTo.plus({ days: 1 }));
          const newStart_dt =
            DateTime.fromSeconds(timelog.start_dt).plus({ days: 1 }).valueOf() / 1000;
          const newEnd_dt = isPerdiem(timelog)
            ? NaN
            : DateTime.fromSeconds(timelog.end_dt).plus({ days: 1 }).valueOf() / 1000;
          if (isTimelog(timelog)) {
            setTimelog({
              ...timelog,
              start_dt: newStart_dt,
              end_dt: newEnd_dt,
            });
          } else if (isPerdiem(timelog)) {
            setTimelog({
              ...timelog,
              start_dt: newStart_dt,
            });
          } else if (isShift(timelog)) {
            setTimelog({
              ...timelog,
              start_dt: newStart_dt,
              end_dt: newEnd_dt,
            });
          }
        }
        setTimelog((timelog) => (timelog ? { ...timelog, uuid: null } : null));
        updateLogs();
        return;
      });
    }
  };

  if (isMonthClosed) {
    return (
      <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
        <CardContent>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("month_is_closed")}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
      <form onSubmit={handleCommit}>
        <CardHeader></CardHeader>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <FormControl fullWidth>
                <DatePicker
                  views={["day"]}
                  label={t("day")}
                  // disabled={} projectstate is setted
                  minDate={dateFrom.set({ day: 1 })}
                  maxDate={dateFrom.endOf("month")}
                  value={dateFrom}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDateFrom((currentDateTo) =>
                        currentDateTo.set({
                          day: newValue.day,
                        }),
                      );
                      setDateTo((currentDateTo) =>
                        currentDateTo.set({
                          day: newValue.day,
                        }),
                      );
                    }
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </FormControl>
            </Grid>
            {projectTypes && (
              <Grid item xs={12} sm={7} md={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id="select-label-typeState">{t("type")}</InputLabel>
                  <Select
                    labelId="select-label-type"
                    id="demo-simple-select-type"
                    value={type}
                    required={true}
                    label={t("type")}
                    // disabled={!props.types.length}
                    onChange={setTypeHandler}
                  >
                    {projectTypes.map((singleType, idx) => (
                      <MenuItem key={idx} value={singleType}>
                        {singleType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          {timelog && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {isShift(timelog) && (
                <Inputshift
                  shiftType={shift}
                  shiftTimelog={timelog}
                  setShiftTimelog={setTimelog}
                />
              )}
              {isTimelog(timelog) && projectTypes && (
                <InputDefaultTimelog
                  types={projectTypes}
                  defaultTimelog={timelog}
                  setDefaultTimelog={setTimelog}
                />
              )}
              {isPerdiem(timelog) && (
                <InputPerdiem
                  perdiemTimelog={timelog}
                  setPerdiemTimelog={setTimelog}
                  model={model}
                />
              )}
            </Grid>
          )}
        </CardContent>
        <CardActions>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
                size="large"
                variant="contained"
                startIcon={<NoteAddIcon />}
                type="submit"
                onClick={() => setAutoNextDay(true)}
                disabled={props.monthIsClosed || submitBtnDisabled || alertShownInInput}
                data-testid={"InputCard_commit-info-btn_index"}
              >
                {t("commit_&_next_day")}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
                size="large"
                variant="contained"
                startIcon={<NoteAddIcon />}
                type="submit"
                onClick={() => setAutoNextDay(false)}
                disabled={props.monthIsClosed || submitBtnDisabled || alertShownInInput}
                data-testid={"InputCard_commit-stay_date-btn_index"}
              >
                {t("commit_&_same_day")}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  );
}
