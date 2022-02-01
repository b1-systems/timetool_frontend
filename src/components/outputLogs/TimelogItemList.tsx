import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Container,
  Grid,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  currentMonthLogsPerdiemsState,
  currentMonthLogsTimelogsState,
} from "../../atom";
import OutputPerdiem from "./OutputPerdiem";
import OutputShift from "./OutputShift";
import OutputTimelogs from "./OutputTimelog";

export default function InputCard(props: {
  setEndMonthOpen(open: boolean): void;
  monthIsClosed: boolean;
}) {
  const { t } = useTranslation();
  const [timelogsVisible, setTimelogsVisible] = useState<boolean>(true);
  const [perdiemsVisible, setPerdiemsVisible] = useState<boolean>(true);
  const [shiftsVisible, setShiftsVisible] = useState<boolean>(true);

  const oldTimelogs = useRecoilValue(currentMonthLogsTimelogsState);
  const oldPerdiems = useRecoilValue(currentMonthLogsPerdiemsState);

  let defaultTimelogs = oldTimelogs
    .filter((log) => log.type === "default")
    .sort(function (x, y) {
      return x.start_dt - y.start_dt;
    });

  let shiftTimelogs = oldTimelogs
    .filter((log) => log.type === "shift")
    .sort(function (x, y) {
      return x.start_dt - y.start_dt;
    });

  let perdiems = oldPerdiems.sort(function (x, y) {
    return x.start_dt - y.start_dt;
  });
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
      <CardContent>
        {!!defaultTimelogs.length && (
          <ul>
            <Grid container alignItems="center">
              <Grid item>
                <h3>{t("timelogs")}</h3>
              </Grid>
              <Grid item>
                <Button
                  color="info"
                  size="small"
                  onClick={() => setTimelogsVisible(!timelogsVisible)}
                >
                  {timelogsVisible && <ExpandLessIcon />}
                  {!timelogsVisible && <ExpandMoreIcon />}
                </Button>
              </Grid>
            </Grid>
            <Collapse orientation="vertical" in={timelogsVisible}>
              {defaultTimelogs.map((log, index) => (
                <Box sx={{ p: 0, mt: 1, mb: 1 }} key={log.uuid}>
                  <OutputTimelogs
                    monthIsClosed={props.monthIsClosed}
                    log={log}
                    index={index}
                    key={log.uuid}
                  />
                </Box>
              ))}
            </Collapse>
          </ul>
        )}
        {!!shiftTimelogs.length && (
          <ul>
            <Grid container alignItems="center">
              <Grid item>
                <h3>{t("shifts")}</h3>
              </Grid>
              <Grid item>
                <Button
                  color="info"
                  size="small"
                  onClick={() => setShiftsVisible(!shiftsVisible)}
                >
                  {shiftsVisible && <ExpandLessIcon />}
                  {!shiftsVisible && <ExpandMoreIcon />}
                </Button>
              </Grid>
            </Grid>
            <Collapse orientation="vertical" in={shiftsVisible}>
              {shiftTimelogs.map((log, index) => (
                <Box sx={{ p: 0, mt: 1, mb: 1 }} key={log.uuid}>
                  <OutputShift
                    index={index}
                    monthIsClosed={props.monthIsClosed}
                    log={log}
                    key={log.uuid}
                  />
                </Box>
              ))}
            </Collapse>
          </ul>
        )}
        {!!perdiems.length && (
          <ul>
            <Grid container alignItems="center">
              <Grid item>
                <h3>{t("perdiems")}</h3>
              </Grid>
              <Grid item>
                <Button
                  color="info"
                  size="small"
                  onClick={() => setPerdiemsVisible(!perdiemsVisible)}
                >
                  {perdiemsVisible && <ExpandLessIcon />}
                  {!perdiemsVisible && <ExpandMoreIcon />}
                </Button>
              </Grid>
            </Grid>
            <Collapse orientation="vertical" in={perdiemsVisible}>
              {perdiems.map((log, index) => (
                <Box sx={{ p: 0, mt: 1, mb: 1 }} key={log.uuid}>
                  <OutputPerdiem
                    index={index}
                    monthIsClosed={props.monthIsClosed}
                    log={log}
                    key={log.uuid}
                  />
                </Box>
              ))}
            </Collapse>
          </ul>
        )}
        {defaultTimelogs.length + shiftTimelogs.length + perdiems.length === 0 && (
          <Container>
            <Box sx={{ mx: "auto", textAlign: "center", p: 5 }}>
              <Alert severity="info" sx={{ textAlign: "center" }}>
                {t("no_timelogs_have_been_made_yet")}
              </Alert>
            </Box>
          </Container>
        )}
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
              disabled={props.monthIsClosed}
              onClick={() => props.setEndMonthOpen(true)}
            >
              {t("end_month")}
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
