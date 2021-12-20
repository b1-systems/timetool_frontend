import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DatePicker from "@mui/lab/DatePicker";
import {
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
import { v4 as uuidv4 } from "uuid";

import { fetchSubmit } from "../../api";
import { Incident } from "../../models";
import InputDefaultTimelog from "./InputDefaultTimelog";
import InputPerdiem from "./InputPerdiem";
import Inputshift from "./InputShift";

export default function InputCard(props: {
  monthIsClosed: boolean;
  fetchAfterSubmitHandler(): void;
  projectShiftModelsAsObject: Object;
  types: string[];
  month: DateTime;
  uuidProject: string | null;
  uuidLog: string | null;
  projectShiftModels: string[];
  projectPerdiemtModelsAsObject: Object;
}) {
  const { t } = useTranslation();
  const [type, setType] = useState<string>(props.types[0]);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<DateTime>(
    props.month.set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }),
  );
  const [remote, setRemote] = useState<boolean>(true);
  const [shift, setShift] = useState<string>("");
  const [shiftModel, setShiftModel] = useState<string>("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [from, setFrom] = useState<DateTime>(
    props.month.set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }),
  );
  const [to, setTo] = useState<DateTime>(
    props.month.set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }),
  );
  const [typeOfPerdiem, setTypeOfPerdiem] = useState<number>(-1);

  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let onsiteRemote = "remote";
    if (remote === false) {
      onsiteRemote = "onsite";
    }
    if (type === "shift" && props.uuidProject) {
      fetchSubmit({
        uuid: props.uuidLog || uuidv4(),
        project_uuid: props.uuidProject,
        start_dt: Math.round(selectedDay.valueOf() / 1000),
        end_dt: Math.round(
          selectedDay.plus({ hours: 23, minutes: 59 }).valueOf() / 1000,
        ),
        type: type,
        incidents: incidents,
        shift_model: shiftModel,
        timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
    if (type === "timelog" && props.uuidProject && from && to) {
      fetchSubmit({
        uuid: props.uuidLog || uuidv4(),
        project_uuid: props.uuidProject,
        start_dt: Math.round(from.valueOf() / 1000),
        end_dt: Math.round(to.valueOf() / 1000),
        type: type,
        breakTime: breakTime * 60,
        travelTime: travelTime * 60,
        comment: logMsg,
        onsite: onsiteRemote,
        timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
    if (type === "perdiem" && props.uuidProject && selectedDay) {
      fetchSubmit({
        uuid: props.uuidLog || uuidv4(),
        project_uuid: props.uuidProject,
        start_dt: Math.round(selectedDay.valueOf() / 1000),
        type: typeOfPerdiem,
        comment: logMsg,
        is_perdiem: true,
        timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
    props.fetchAfterSubmitHandler();
  };

  const handleRemote = () => {
    setRemote(!remote);
  };

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
                  minDate={props.month}
                  maxDate={props.month.plus({ months: 1 }).minus({ day: 1 })}
                  value={selectedDay}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDay(newValue);
                      setFrom(newValue);
                      setTo(newValue);
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
                  value={t("type")}
                  label="Type"
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
                projectShiftModelsAsObject={props.projectShiftModelsAsObject}
                shiftModels={props.projectShiftModels}
                setShift={setShift}
                shift={shift}
                incidents={incidents}
                setIncidents={setIncidents}
                day={selectedDay}
                setShiftModel={setShiftModel}
              />
            )}

            {type === "timelog" && (
              <InputDefaultTimelog
                day={selectedDay}
                to={to}
                from={from}
                setToCard={setTo}
                setFromCard={setFrom}
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
                projectPerdiemtModelsAsObject={props.projectPerdiemtModelsAsObject}
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
                disabled={props.monthIsClosed}
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
