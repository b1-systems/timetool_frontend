import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import FlightIcon from "@mui/icons-material/Flight";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Button, Card, CardActions, Grid } from "@mui/material";
import { DateTime, Duration } from "luxon";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { useUpdateLogs } from "../../atom";
import { Timelog } from "../../models";
import OutputChip from "./OutputChip";

export default function OutputTimelogs(props: {
  monthIsClosed: boolean;

  log: Timelog;
  index: number;
}) {
  const updateLogs = useUpdateLogs();

  const { t } = useTranslation();
  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype)
      .then(() => updateLogs())
      .catch((errorUpdateLogs) => console.error(errorUpdateLogs));
  };
  const breaktime =
    typeof props.log.breaklength === "number" && props.log.breaklength > 0
      ? new Date(props.log.breaklength * 1000).toISOString().substring(11, 16)
      : "00:00";
  const traveltime =
    typeof props.log.travel === "number" && props.log.travel > 0
      ? new Date(props.log.travel * 1000).toISOString().substring(11, 16)
      : "00:00";
  const worktime =
    props.log.end_dt - props.log.start_dt > 0
      ? Duration.fromMillis(
          (props.log.end_dt -
            props.log.start_dt -
            (props.log.breaklength ? props.log.breaklength : 0)) *
            1000,
        ).toISOTime({ suppressSeconds: true })
      : "00:00";

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: props.index % 2 ? "white" : "#eeeeee",
        p: 0,
        border: 1,
        borderColor: "#dedede",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box
            bgcolor={props.index % 2 ? "white" : "#eeeeee"}
            sx={{
              flexWrap: "wrap",
              display: "flex",
              p: 0,
              m: 0,
              justifyContent: "space-evenly",
            }}
          >
            <Grid container spacing={0} alignItems="stretch">
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.date")}
                Icon={<EventIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}
              />
              <OutputChip
                lg={2}
                index={props.index}
                heading={t("keypoint.project")}
                Icon={
                  <DriveFileRenameOutlineIcon
                    sx={{ width: 18, height: 18, color: "white" }}
                  />
                }
                text={props.log.project_name}
              />
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.from")}
                Icon={<AccessTimeIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={DateTime.fromSeconds(props.log.start_dt).toFormat("T")}
              />
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.to")}
                Icon={<MoreTimeIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={DateTime.fromSeconds(props.log.end_dt).toFormat("T")}
              />
              <OutputChip
                lg={3}
                index={props.index}
                heading={t("keypoint.comment")}
                Icon={<ChatIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={props.log.comment || "no comment"}
              />
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.onsite")}
                Icon={<MyLocationIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={props.log.onsite || "remote"}
              />
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.times_work")}
                Icon={<WorkIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={`${worktime}`}
              />
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.times_break")}
                Icon={
                  <FreeBreakfastIcon sx={{ width: 18, height: 18, color: "white" }} />
                }
                text={`${breaktime}`}
              />
              <OutputChip
                lg={1}
                index={props.index}
                heading={t("keypoint.times_travel")}
                Icon={<FlightIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={`${traveltime}`}
              />
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <CardActions>
        {!props.monthIsClosed && (
          <Button
            color="error"
            size="small"
            variant="contained"
            onClick={() => deleteHandler(props.log.uuid)}
            disabled={props.monthIsClosed}
            data-testid={`OutputTimelog_delete-error-btn_index-${props.index}`}
          >
            <DeleteForeverIcon />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
