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
import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { fetchSubmit } from "../../api";
import {
  alertShownInInputState,
  dateFromState,
  dateToState,
  editTimelogState,
  isMonthClosedState,
  useUpdateLogs,
} from "../../atom";
import { Incident } from "../../models";
import InputDefaultTimelog from "./InputDefaultTimelog";
import InputPerdiem from "./InputPerdiem";
import Inputshift from "./InputShift";

export default function InputCard(props: {
  monthIsClosed: boolean;
  types: string[];
  setProjectUuid(uuid: string): void;
  setUuidLog(uuid: string | null): void;
  uuidProject: string;
  uuidLog: string | null;
  projectShiftModels: string[];
  perdiemModels: string[];
}) {
  const { t } = useTranslation();
  const [model, setModel] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [breakTime, setBreakTime] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>("");
  const [dateFrom, setDateFrom] = useRecoilState(dateFromState);
  const [dateTo, setDateTo] = useRecoilState(dateToState);
  const [remote, setRemote] = useState<boolean>(true);
  const [shift, setShift] = useState<string>("");
  const [shiftModel, setShiftModel] = useState<string>("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [typeOfPerdiem, setTypeOfPerdiem] = useState<number>(-1);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [editShift, setEditShift] = useRecoilState(editTimelogState);

  const updateLogs = useUpdateLogs();
  const isMonthClosed = useRecoilValue(isMonthClosedState);
  const alertShownInInput = useRecoilValue(alertShownInInputState);

  useEffect(() => {
    if (props.types.length === 1) {
      setType(props.types[0]);
    }
  }, [props.types]);

  useEffect(() => {
    if (editShift.project_uuid !== "-1" && editShift.start_dt !== -1) {
      setType("shift");
      setDateFrom(DateTime.fromSeconds(editShift.start_dt));
      setShiftModel(editShift.shift_model || "unknown shift");
      setShift(editShift.shift_model || "unknown shift");
      setIncidents(editShift.incidents || []);
    }
  }, [editShift, setDateFrom, shiftModel]);

  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnDisabled(false);
    }, 1000);
    let onsiteRemote = "remote";
    if (remote === false) {
      onsiteRemote = "onsite";
    }
    const commonData = {
      uuid: props.uuidLog || uuidv4(),
      project_uuid: props.uuidProject,
      start_dt: Math.round(dateFrom.valueOf() / 1000),
      timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    let submitData;
    let incidentsChecked: Incident[] = [];
    if (type === "shift" && props.uuidProject) {
      let overZero = false;
      let lastTimeChecked = -1;
      incidents.forEach((incident) => {
        if (lastTimeChecked !== -1) {
          if (lastTimeChecked > incident.start_dt) {
            overZero = true;
          }
        }
        if (!overZero) {
          if (incident.end_dt < incident.start_dt) {
            incidentsChecked.push({
              start_dt: incident.start_dt,
              end_dt:
                DateTime.fromSeconds(incident.end_dt).plus({ days: 1 }).valueOf() /
                1000,
              comment: incident.comment,
            });
            lastTimeChecked = incident.end_dt;
            overZero = true;
          } else {
            incidentsChecked.push(incident);
            lastTimeChecked = incident.end_dt;
          }
        } else {
          incidentsChecked.push({
            start_dt:
              DateTime.fromSeconds(incident.start_dt).plus({ days: 1 }).valueOf() /
              1000,
            end_dt:
              DateTime.fromSeconds(incident.end_dt).plus({ days: 1 }).valueOf() / 1000,
            comment: incident.comment,
          });
        }
      });
      submitData = {
        ...commonData,
        end_dt: Math.round(dateFrom.plus({ hours: 23, minutes: 59 }).valueOf() / 1000),
        type: type,
        incidents: incidentsChecked,
        shift_model: shiftModel,
      };
      overZero = false;
    } else if (type === "timelog" && props.uuidProject && dateFrom && dateTo) {
      submitData = {
        ...commonData,
        end_dt:
          dateTo.valueOf() < dateFrom.valueOf()
            ? Math.round(dateTo.plus({ days: 1 }).valueOf() / 1000)
            : Math.round(dateTo.valueOf() / 1000),
        type: type,
        breakTime: breakTime * 60,
        travelTime: travelTime * 60,
        comment: logMsg,
        onsite: onsiteRemote,
      };
    } else if (type === "perdiem" && props.uuidProject && dateFrom) {
      submitData = {
        ...commonData,
        type: typeOfPerdiem,
        comment: logMsg,
        is_perdiem: true,
      };
    } else {
      throw new Error("not a valid submit");
    }
    fetchSubmit(submitData).then(() => {
      setDateFrom(dateFrom.plus({ days: 1 }));
      setDateTo(dateTo.plus({ days: 1 }));
      setIncidents([]);
      setEditShift({
        uuid: "-1",
        employee_uuid: "-1",
        project_uuid: "-1",
        project_name: "-1",
        start_dt: -1,
        end_dt: -1,
        type: "-1",
      });
      props.setUuidLog(null);
      updateLogs();
    });
  };

  const handleRemote = () => {
    setRemote(!remote);
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
      <form onSubmit={handleSubmit}>
        <CardHeader></CardHeader>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <FormControl fullWidth>
                <DatePicker
                  views={["day"]}
                  label={t("day")}
                  disabled={!props.uuidProject}
                  minDate={dateFrom.set({ day: 1 })}
                  maxDate={dateFrom.endOf("month")}
                  value={dateFrom}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDateFrom((currentDateTo) =>
                        currentDateTo.set({ day: newValue.day }),
                      );
                      setDateTo((currentDateTo) =>
                        currentDateTo.set({ day: newValue.day }),
                      );
                      setIncidents([]);
                      props.setUuidLog(null);
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
                  value={type}
                  required={true}
                  label={t("type")}
                  disabled={!props.types.length}
                  onChange={setTypeHandler}
                >
                  {props.types.map((singleType, idx) => (
                    <MenuItem key={idx} value={singleType}>
                      {singleType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {type === "shift" && (
              <Inputshift
                setUuidLog={props.setUuidLog}
                uuidProject={props.uuidProject}
                shiftModels={props.projectShiftModels}
                setShift={setShift}
                shift={shift}
                incidents={incidents}
                setIncidents={setIncidents}
                setShiftModel={setShiftModel}
              />
            )}

            {type === "timelog" && (
              <InputDefaultTimelog
                types={props.types}
                handleRemote={handleRemote}
                setBreakTime={setBreakTime}
                breakTime={breakTime}
                setTravelTime={setTravelTime}
                travelTime={travelTime}
                setLogMsg={setLogMsg}
                logMsg={logMsg}
              />
            )}

            {type === "perdiem" && (
              <InputPerdiem
                model={model}
                perdiemModels={props.perdiemModels}
                setModel={setModel}
                uuidProject={props.uuidProject}
                setTypeOfPerdiem={setTypeOfPerdiem}
                setLogMsg={setLogMsg}
                logMsg={logMsg}
              />
            )}
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
                size="large"
                variant="contained"
                startIcon={<NoteAddIcon />}
                type="submit"
                disabled={props.monthIsClosed || submitBtnDisabled || alertShownInInput}
              >
                {t("commit")}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  );
}
