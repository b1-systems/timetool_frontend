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

import { fetchCurrentMonthLogs, fetchIsMonthClosed, fetchProjects } from "../api";
import DummyCard from "../dummyData/DummyCard";
import {
  Logs,
  Perdiem,
  PerdiemModelsToProjectUuid,
  Project,
  ShiftModelsToProjectUuid,
  Timelog,
} from "../models";
import MonthEndDialog from "./MonthEndDialog";
import InputCard from "./inputLogs/InputCard";
import TimelogItemList from "./outputLogs/TimelogItemList";

/**
 * Main Component to bundle all cards
 */

export default function MainGrid() {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState<DateTime>(
    DateTime.now().set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }),
  );
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [oldTimelogs, setOldTimelogs] = useState<Timelog[]>([]);
  const [oldPerdiems, setOldPerdiems] = useState<Perdiem[]>([]);
  const [project, setProject] = useState<string>("");
  const [projectUuid, setProjectUuid] = useState<string | null>(null);
  const [uuidLog, setUuidLog] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [projectShiftModels, setProjectShiftModels] = useState<string[]>([]);
  const [monthIsClosed, setMonthIsClosed] = useState<boolean>(true);
  const [projectShiftModelsAsObject, setProjectShiftModelsAsObject] =
    useState<ShiftModelsToProjectUuid>({});
  const [projectPerdiemtModelsAsObject, setProjectPerdiemtModelsAsObject] =
    useState<PerdiemModelsToProjectUuid>({});

  //useEffect has disable eslint because an empty array can be used to only use it at initial render
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      setMonthGetProjectsHandler(selectedMonth);
      fetchIsMonthClosed({
        params: {
          year: selectedMonth.year,
          month: selectedMonth.month,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTimelog = (uuid: string) => {
    setOldTimelogs(oldTimelogs.filter((log) => log.uuid !== uuid));
  };

  const deletePerdiem = (uuid: string) => {
    setOldPerdiems(oldPerdiems.filter((log) => log.uuid !== uuid));
  };

  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  const setMonthGetProjectsHandler = (newDate: DateTime) => {
    setSelectedMonth(newDate);
    let requestPrototype;
    if (newDate !== null) {
      requestPrototype = {
        params: {
          year: newDate.year,
          month: newDate.month,
          format: "traditional",
          scope: "me",
        },
      };
      fetchProjects(requestPrototype)
        .then((response) => {
          return response.json();
        })
        .then((projectsResponse) => {
          setAvailableProjects(projectsResponse.projects);
        });
      fetchCurrentMonthLogs(requestPrototype)
        .then((response) => {
          return response.json();
        })
        .then((LogsResponse: Logs) => {
          setOldTimelogs(LogsResponse.timelogs);
          setOldPerdiems(LogsResponse.perdiems);
        });
      fetchIsMonthClosed({
        params: {
          year: selectedMonth.year,
          month: selectedMonth.month,
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
    let objPerdiemModels: PerdiemModelsToProjectUuid = {};
    let objShiftModels: ShiftModelsToProjectUuid = {};
    availableProjects.forEach((project) => {
      if (project.worktypes.perdiem) {
        objPerdiemModels = {
          ...objPerdiemModels,
          [project.uuid]: project.worktypes.perdiem,
        };
      }
      if (project.worktypes.shift) {
        objShiftModels = { ...objShiftModels, [project.uuid]: project.worktypes.shift };
      }
    });
    setProjectShiftModelsAsObject(objShiftModels);
    setProjectPerdiemtModelsAsObject(objPerdiemModels);
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
  };

  //timelogs and perdiems are in one and the same response, but sorted out here
  const fetchAfterSubmitHandler = () => {
    fetchCurrentMonthLogs({
      params: {
        year: selectedMonth.year,
        month: selectedMonth.month,
        format: "traditional",
        scope: "me",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((LogsResponse: Logs) => {
        setOldTimelogs(LogsResponse.timelogs);
        setOldPerdiems(LogsResponse.perdiems);
      });
    setUuidLog(null);
  };

  return (
    <Grid container spacing={3}>
      {process.env.NODE_ENV === "development" && (
        <DummyCard
          setAvailableProjects={setAvailableProjects}
          setOldTimelogs={setOldTimelogs}
          setOldPerdiems={setOldPerdiems}
          setMonthIsClosed={setMonthIsClosed}
          setSelectedMonth={setSelectedMonth}
          setProjectShiftModelsAsObject={setProjectShiftModelsAsObject}
          setProjectPerdiemtModelsAsObject={setProjectPerdiemtModelsAsObject}
        ></DummyCard>
      )}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
          {endMonthOpen && (
            <MonthEndDialog
              close={monthEndHandler}
              selectedMonth={selectedMonth}
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
                    value={selectedMonth}
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
                    disabled={!selectedMonth}
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
          monthIsClosed={monthIsClosed}
          fetchAfterSubmitHandler={fetchAfterSubmitHandler}
          projectPerdiemtModelsAsObject={projectPerdiemtModelsAsObject}
          projectShiftModelsAsObject={projectShiftModelsAsObject}
          types={projectTypes}
          month={selectedMonth}
          uuidProject={projectUuid}
          uuidLog={uuidLog}
          projectShiftModels={projectShiftModels}
        />
      </Grid>
      <Grid item xs={12}>
        <TimelogItemList
          projectShiftModelsAsObject={projectShiftModelsAsObject}
          projectPerdiemtModelsAsObject={projectPerdiemtModelsAsObject}
          monthIsClosed={monthIsClosed}
          deleteTimelog={deleteTimelog}
          deletePerdiem={deletePerdiem}
          timelogs={oldTimelogs}
          perdiems={oldPerdiems}
          setEndMonthOpen={setEndMonthOpen}
        />
      </Grid>
    </Grid>
  );
}
