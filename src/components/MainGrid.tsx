import DatePicker from "@mui/lab/DatePicker";
import {
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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { fetchIsMonthClosed } from "../api";
import { dateFromState, projectsState } from "../atom";
import DummyCard from "../dummyData/DummyCard";
import { PerdiemModelsToProjectUuid, ShiftModelsToProjectUuid } from "../models";
import MonthEndDialog from "./MonthEndDialog";
import InputCard from "./inputLogs/InputCard";
import TimelogItemList from "./outputLogs/TimelogItemList";

/**
 * Main Component to bundle all cards
 */

export default function MainGrid() {
  const { t } = useTranslation();
  const [dateFrom, setDateFrom] = useRecoilState(dateFromState);
  const availableProjects = useRecoilValue(projectsState);
  const [project, setProject] = useState<string>("");
  const [projectUuid, setProjectUuid] = useState<string>("");
  const [uuidLog] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [projectShiftModels, setProjectShiftModels] = useState<string[]>([]);
  const [perdiemModels, setPerdiemModels] = useState<string[]>([]);
  const [monthIsClosed, setMonthIsClosed] = useState<boolean>(true);
  const [projectShiftModelsAsObject, setProjectShiftModelsAsObject] =
    useState<ShiftModelsToProjectUuid>({});
  const [projectPerdiemModelsAsObject, setProjectPerdiemtModelsAsObject] =
    useState<PerdiemModelsToProjectUuid>({});

  //useEffect has disable eslint because an empty array can be used to only use it at initial render
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      setMonthGetProjectsHandler(dateFrom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  const setMonthGetProjectsHandler = (newDate: DateTime) => {
    setDateFrom(newDate);
    if (newDate !== null) {
      fetchIsMonthClosed({
        params: {
          year: newDate.year,
          month: newDate.month,
          format: "traditional",
          scope: "me",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          if (response.locks.length === 0) {
            setMonthIsClosed(false);
          } else {
            setMonthIsClosed(true);
          }
        });
    }
  };

  const setProjectGetLogsHandler = (event: SelectChangeEvent) => {
    const projectFiltered = availableProjects.filter(
      (project) => project.name === (event.target.value as string),
    );
    setProject(event.target.value as string);
    setProjectUuid(projectFiltered[0].uuid);
    setProjectTypes(Object.keys(projectFiltered[0].worktypes));
    if (projectFiltered[0].worktypes.shift !== undefined) {
      setProjectShiftModels(Object.values(projectFiltered[0].worktypes.shift));
    }
    if (projectFiltered[0].worktypes.perdiem !== undefined) {
      setPerdiemModels(Object.values(projectFiltered[0].worktypes.perdiem));
    }
  };

  return (
    <Grid container spacing={3}>
      {process.env.NODE_ENV === "development" && (
        <DummyCard
          setMonthIsClosed={setMonthIsClosed}
          setProjectShiftModelsAsObject={setProjectShiftModelsAsObject}
          setProjectPerdiemtModelsAsObject={setProjectPerdiemtModelsAsObject}
        ></DummyCard>
      )}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
          {endMonthOpen && (
            <MonthEndDialog
              close={monthEndHandler}
              setMonthIsClosed={setMonthIsClosed}
            />
          )}
          <CardHeader></CardHeader>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={3} lg={2}>
                <FormControl fullWidth>
                  <DatePicker
                    views={["year", "month"]}
                    label={t("year_and_month")}
                    minDate={DateTime.fromISO("2000-01-01T00:00")}
                    maxDate={DateTime.fromISO("2100-01-01T00:00")}
                    value={dateFrom}
                    onChange={(newValue) => {
                      if (newValue) {
                        setMonthGetProjectsHandler(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} helperText={null} />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={7} md={6} lg={4}>
                <FormControl fullWidth>
                  <InputLabel id="select-label-projectState">{t("project")}</InputLabel>
                  <Select
                    labelId="select-label-project"
                    id="demo-simple-select-project"
                    value={project}
                    label={t("project")}
                    onChange={setProjectGetLogsHandler}
                    disabled={!dateFrom}
                  >
                    {availableProjects.map((project) => (
                      <MenuItem key={project.uuid} value={project.name}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} lg={2}></Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <InputCard
          perdiemModels={perdiemModels}
          monthIsClosed={monthIsClosed}
          projectPerdiemModelsAsObject={projectPerdiemModelsAsObject}
          projectShiftModelsAsObject={projectShiftModelsAsObject}
          types={projectTypes}
          uuidProject={projectUuid}
          uuidLog={uuidLog}
          projectShiftModels={projectShiftModels}
        />
      </Grid>
      <Grid item xs={12}>
        <TimelogItemList
          monthIsClosed={monthIsClosed}
          setEndMonthOpen={setEndMonthOpen}
        />
      </Grid>
    </Grid>
  );
}
