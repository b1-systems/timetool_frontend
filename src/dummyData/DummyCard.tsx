import { Button, Card, Grid } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";

import {
  _dummy_old_logs_1,
  _dummy_old_logs_2,
  _dummy_projects,
} from "../dummyData/dummyData";
import { Perdiem, Project, Timelog } from "../models";

interface Props {
  setAvailableProjects(_dummy_projects: Project[]): void;
  setOldTimelogs(_dummy_timelogs: Timelog[]): void;
  setOldPerdiems(_dummy_perdiems: Perdiem[]): void;
  setMonthIsClosed(isClosed: boolean): void;
  setSelectedMonth(date: DateTime): void;
}
export default function DummyCard(props: Props) {
  return (
    <Grid item xs={12}>
      <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
        this card only for testing without backend
        <Button
          onClick={() => {
            //setSelectedMonth(selectedMonth);
            props.setAvailableProjects(_dummy_projects);
            props.setOldTimelogs(_dummy_old_logs_1.timelogs);
            props.setOldPerdiems(_dummy_old_logs_1.perdiems);
            props.setMonthIsClosed(false);
          }}
        >
          _dummy_1
        </Button>
        <Button
          onClick={() => {
            //setSelectedMonth(selectedMonth);
            props.setAvailableProjects(_dummy_projects);
            props.setOldTimelogs(_dummy_old_logs_2.timelogs);
            props.setOldPerdiems(_dummy_old_logs_2.perdiems);
            props.setMonthIsClosed(false);
          }}
        >
          _dummy_2
        </Button>
        <Button
          onClick={() => {
            props.setSelectedMonth(DateTime.fromISO("2001-01-01T00:00"));
            props.setMonthIsClosed(false);
          }}
        >
          _dummy_set_Month
        </Button>
      </Card>
    </Grid>
  );
}
