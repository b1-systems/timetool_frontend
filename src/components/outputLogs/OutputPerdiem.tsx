import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import { Avatar, Box, Button, Card, Chip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { ModelsPerdiem, Perdiem } from "../../models";

export default function OutputPerdiem(props: {
  projectPerdiemtModelsAsObject: { [key: string]: ModelsPerdiem };
  monthIsClosed: boolean;
  log: Perdiem;
  deletePerdiem(uuid: string): void;
  index: number;
}) {
  const { t } = useTranslation();

  const perdiemModelHandler = (uuid: string, type: number): string => {
    if (Object.keys(props.projectPerdiemtModelsAsObject).length !== 0) {
      if (props.projectPerdiemtModelsAsObject[uuid]) {
        for (const [key, value] of Object.entries(
          props.projectPerdiemtModelsAsObject[uuid],
        )) {
          if (key === type.toString()) {
            return value;
          }
        }
      }
    }
    return "unknown type";
  };

  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype);
    props.deletePerdiem(uuid);
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
            t("keypoint.type") +
            perdiemModelHandler(props.log.project_uuid, props.log.type)
          }
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              <PaidIcon sx={{ width: 18, height: 18, color: "white" }} />
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
