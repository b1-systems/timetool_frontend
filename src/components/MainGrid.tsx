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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  autoTypeNotDoneState,
  editTimelogState,
  isMonthClosedState,
  monthState,
  projectState,
  projectsState,
  startDtOfTimelogState,
  useSetProjectIfOnlyOne,
} from "../atom";
import { Timelog } from "../models";
import MonthEndDialog from "./MonthEndDialog";
import InputCard from "./inputLogs/InputCard";
import TimelogItemList from "./outputLogs/TimelogItemList";

/**
 * Main Component to bundle all cards
 */

export default function MainGrid() {
  const { t } = useTranslation();
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const dateFrom = useRecoilValue(startDtOfTimelogState);
  const availableProjects = useRecoilValue(projectsState);
  const [project, setProject] = useRecoilState(projectState);
  const [month, setMonth] = useRecoilState(monthState);
  const isMonthClosed = useRecoilValue(isMonthClosedState);
  const setAutoTypeNotDone = useSetRecoilState(autoTypeNotDoneState);
  const setTimelog = useSetRecoilState<Timelog | null>(editTimelogState);
  const setProjectIfOnlyOne = useSetProjectIfOnlyOne();
  setProjectIfOnlyOne();
  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
          {endMonthOpen && (
            <MonthEndDialog
              close={monthEndHandler}
              year={month.year}
              monthLong={month.monthLong}
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
                    value={month}
                    onChange={(newValue) => {
                      if (newValue) {
                        setMonth(newValue);
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
                    value={project}
                    onChange={(event, value) => {
                      setAutoTypeNotDone(() => true);
                      setProject(() => value);
                      setTimelog(() => null);
                    }}
                    disabled={!dateFrom}
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
        <InputCard monthIsClosed={isMonthClosed} />
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
