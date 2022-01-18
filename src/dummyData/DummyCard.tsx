import { Button, Card, Grid } from "@mui/material";
import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { dateFromState } from "../atom";
import { PerdiemModelsToProjectUuid, ShiftModelsToProjectUuid } from "../models";
import { _dummy_projects } from "./dummyData";

interface Props {
  setMonthIsClosed(isClosed: boolean): void;
  setProjectShiftModelsAsObject(objShiftModels: ShiftModelsToProjectUuid): void;
  setProjectPerdiemtModelsAsObject(objPerdiemModels: PerdiemModelsToProjectUuid): void;
}
export default function DummyCard(props: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      let objPerdiemModels: PerdiemModelsToProjectUuid = {};
      let objShiftModels: ShiftModelsToProjectUuid = {};
      _dummy_projects.forEach((project) => {
        if (project.worktypes.perdiem) {
          objPerdiemModels = {
            ...objPerdiemModels,
            [project.uuid]: project.worktypes.perdiem,
          };
        }
        if (project.worktypes.shift) {
          objShiftModels = {
            ...objShiftModels,
            [project.uuid]: project.worktypes.shift,
          };
        }
      });
      props.setProjectShiftModelsAsObject(objShiftModels);
      props.setProjectPerdiemtModelsAsObject(objPerdiemModels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [, setDateFrom] = useRecoilState(dateFromState);
  return (
    <Grid item xs={12}>
      <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
        this card only for testing without backend
        <Button
          onClick={() => {
            //setSelectedMonth(selectedMonth);
            props.setMonthIsClosed(false);
          }}
        >
          _dummy_1
        </Button>
        <Button
          onClick={() => {
            //setSelectedMonth(selectedMonth);
            props.setMonthIsClosed(false);
          }}
        >
          _dummy_2
        </Button>
        <Button
          onClick={() => {
            setDateFrom(DateTime.fromISO("2001-01-01T00:00"));
            props.setMonthIsClosed(false);
          }}
        >
          _dummy_set_Month
        </Button>
      </Card>
    </Grid>
  );
}
