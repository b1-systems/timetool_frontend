import {
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { autoTypeNotDoneState } from "../atom";
import {
  useAvailableProjects,
  useSelectedProject,
  useSetProjectIfOnlyOne,
} from "../atoms/projects";
import { useIsMonthClosed, useSelectedMonth } from "../atoms/selectedDate";
import MonthEndDialog from "./MonthEndDialog";
import InputCard from "./inputLogs/InputCard";
import TimelogItemList from "./outputLogs/TimelogItemList";

/**
 * Main Component to bundle all cards
 */

export default function MainGrid() {
  const { t } = useTranslation();
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useSelectedMonth();
  const isMonthClosed = useIsMonthClosed();
  const availableProjects = useAvailableProjects();
  const [selectedProject, setSelectedProject] = useSelectedProject();
  useSetProjectIfOnlyOne();
  const setAutoTypeNotDone = useSetRecoilState(autoTypeNotDoneState);

  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  // TODO: reset edit state when selected project changes

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
          {endMonthOpen && (
            <MonthEndDialog
              close={monthEndHandler}
              year={selectedMonth.year}
              monthLong={selectedMonth.monthLong}
            />
          )}
          <CardHeader></CardHeader>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={3} lg={2}>
                <FormControl fullWidth>
                  <DatePicker
                    data-testid={`MainGrid_year-and-month-DatPicker`}
                    views={["year", "month"]}
                    label={t("year_and_month")}
                    minDate={DateTime.fromISO("2000-01-01T00:00")}
                    maxDate={DateTime.fromISO("2100-01-01T00:00")}
                    value={selectedMonth}
                    onChange={(newValue) => {
                      if (newValue) {
                        setSelectedMonth(newValue);
                      }
                    }}
                    renderInput={(params: any) => (
                      <TextField {...params} helperText={null} />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={7} md={6} lg={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="select-label-projectState-autocomplete"
                    data-testid={`MainGrid_project-Autocomplete`}
                    options={availableProjects}
                    renderInput={(params) => (
                      <TextField {...params} label={t("project")} />
                    )}
                    value={selectedProject}
                    onChange={(event, value) => {
                      setAutoTypeNotDone(true);
                      setSelectedProject(value);
                    }}
                    getOptionLabel={(project) => project.name}
                  ></Autocomplete>
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
        <InputCard />
      </Grid>
      <Grid item xs={12}>
        <TimelogItemList
          monthIsClosed={isMonthClosed}
          setEndMonthOpen={setEndMonthOpen}
        />
      </Grid>
    </Grid>
  );
}
