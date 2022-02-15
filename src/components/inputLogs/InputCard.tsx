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
  TextField,
} from "@mui/material";
import { DateTime } from "luxon";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  alertShownInInputState,
  autoTypeNotDoneState,
  editTimelogState,
  endDtOfTimelogState,
  isMonthClosedState,
  perdiemModelsState,
  projectState,
  projectTypesState,
  shiftModelsState,
  startDtOfTimelogState,
  useUpdateLogs,
} from "../../atom";
import { handleSubmit } from "../../lib";
import { Timelog, isPerdiem, isShift, isTimelog } from "../../models";
import InputDefaultTimelog from "./InputDefaultTimelog";
import InputPerdiem from "./InputPerdiem";
import Inputshift from "./InputShift";

export default function InputCard(props: { monthIsClosed: boolean }) {
  const { t } = useTranslation();
  const [dateFrom, setDateFrom] = useRecoilState(startDtOfTimelogState);
  const [dateTo, setDateTo] = useRecoilState(endDtOfTimelogState);

  const projectTypes = useRecoilValue(projectTypesState);

  const project = useRecoilValue(projectState);

  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [autoNextDay, setAutoNextDay] = useState<boolean>(true);

  const updateLogs = useUpdateLogs();
  const isMonthClosed = useRecoilValue(isMonthClosedState);
  const alertShownInInput = useRecoilValue(alertShownInInputState);
  const [timelog, setTimelog] = useRecoilState<Timelog | null>(editTimelogState);

  const [autoType, setAutoType] = useRecoilState(autoTypeNotDoneState);

  const perdiemModels = useRecoilValue(perdiemModelsState);
  const perdiemModel = project
    ? Object.keys(perdiemModels.get(project.uuid) || {}).length === 1
      ? parseInt(Object.keys(perdiemModels.get(project.uuid) || {})[0])
      : NaN
    : NaN;

  const shiftModels = useRecoilValue(shiftModelsState);
  const shiftModel = project
    ? Object.keys(shiftModels.get(project.uuid) || {}).length === 1
      ? Object.keys(shiftModels.get(project.uuid) || {})[0]
      : ""
    : "";

  const setTypeHandler = (value: string) => {
    switch (value) {
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
          type: perdiemModel,
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
          shift_model: shiftModel,
        });
        break;
    }
  };

  const autoTypeHandler = () => {
    if (projectTypes) {
      setAutoType(false);
      setTypeHandler(projectTypes[0]);
      return projectTypes[0];
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
  if (!project) {
    return (
      <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
        <CardContent>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("select_a_project")}
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
            <Grid item xs={12} sm={7} md={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id="select-label-typeState">{t("type")}</InputLabel>
                <Select
                  labelId="select-label-type"
                  id="demo-simple-select-type"
                  data-testid={`InputCard_type-Select`}
                  value={
                    timelog === null && projectTypes?.length === 1 && autoType
                      ? autoTypeHandler()
                      : timelog && isPerdiem(timelog)
                      ? "perdiem"
                      : timelog && isTimelog(timelog)
                      ? "timelog"
                      : timelog && isShift(timelog)
                      ? "shift"
                      : ""
                  }
                  required={true}
                  label={t("type")}
                  disabled={!!projectTypes && !projectTypes.length}
                  onChange={(e) => setTypeHandler(e.target.value)}
                >
                  {projectTypes &&
                    projectTypes.map((singleType, idx) => (
                      <MenuItem key={idx} value={singleType}>
                        {singleType}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {timelog && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {isShift(timelog) && projectTypes && (
                <Inputshift
                  types={projectTypes}
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
              {isPerdiem(timelog) && projectTypes && (
                <InputPerdiem
                  types={projectTypes}
                  perdiemTimelog={timelog}
                  setPerdiemTimelog={setTimelog}
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
