import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Avatar, Box, Button, Card, Chip } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { Timelog } from "../../models";

export default function OutputTimelogs(props: {
  monthIsClosed: boolean;
  log: Timelog;
  deleteTimelog(uuid: string): void;
  index: number;
}) {
  const { t } = useTranslation();

  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype);
    props.deleteTimelog(uuid);
  };
  return (
    <Card elevation={0}>
      <Box
        bgcolor={props.index % 2 ? "white" : "#eeeeee"}
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          display: "flex",
          p: 1,
          m: 1,
          justifyContent: "space-evenly",
        }}
      >
        <Chip
          style={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}
          label={
            t("keypoint.date") +
            new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")
          }
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <EventIcon sx={{ width: 18, height: 18, color: "white" }} />
            </Avatar>
          }
        />
        <Chip
          style={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}
          label={t("keypoint.project") + props.log.project_name}
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <DriveFileRenameOutlineIcon
                sx={{ width: 18, height: 18, color: "white" }}
              />
            </Avatar>
          }
        />
        <Chip
          style={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}
          label={
            t("keypoint.from") + DateTime.fromSeconds(props.log.start_dt).toFormat("T")
          }
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccessTimeIcon sx={{ width: 18, height: 18, color: "white" }} />
            </Avatar>
          }
        />
        <Chip
          style={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}
          label={
            t("keypoint.to") + DateTime.fromSeconds(props.log.end_dt).toFormat("T")
          }
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <MoreTimeIcon sx={{ width: 18, height: 18, color: "white" }} />
            </Avatar>
          }
        />
        <Chip
          style={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}
          label={t("keypoint.onsite") + props.log.onsite}
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <MyLocationIcon sx={{ width: 18, height: 18, color: "white" }} />
            </Avatar>
          }
        />
        <Chip
          style={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}
          label={t("keypoint.comment") + props.log.comment}
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <ChatIcon sx={{ width: 18, height: 18, color: "white" }} />
            </Avatar>
          }
        />
        <Button
          color="error"
          onClick={() => deleteHandler(props.log.uuid)}
          disabled={props.monthIsClosed}
        >
          <DeleteForeverIcon />
        </Button>
      </Box>
    </Card>
  );
}
