import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {
  Avatar,
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useEffect, useState } from "react";
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
  const theme = useTheme();
  const extraSmallDisplay = useMediaQuery(theme.breakpoints.up("xs"));
  const smallDisplay = useMediaQuery(theme.breakpoints.up("sm"));
  const mediumDisplay = useMediaQuery(theme.breakpoints.up("md"));
  const LargeDisplay = useMediaQuery(theme.breakpoints.up("lg"));
  const extraLargeDisplay = useMediaQuery(theme.breakpoints.up("xl"));
  const [iconPx, setIconPx] = useState<number>(32);
  const [iconMarginTop, setIconMarginTop] = useState<number>(1);

  useEffect(() => {
    if (extraLargeDisplay) {
      setIconPx(32);
      setIconMarginTop(1);
    } else if (LargeDisplay) {
      setIconPx(24);
      setIconMarginTop(2);
    } else if (mediumDisplay) {
      setIconPx(18);
      setIconMarginTop(2);
    } else if (smallDisplay) {
      setIconPx(0);
    } else if (extraSmallDisplay) {
      setIconPx(0);
    }
  }, [extraSmallDisplay, smallDisplay, mediumDisplay, LargeDisplay, extraLargeDisplay]);

  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype);
    props.deleteTimelog(uuid);
  };
  return (
    <Card elevation={0}>
      <Box bgcolor={props.index % 2 ? "white" : "#eeeeee"}>
        <List style={{ display: "flex", flexDirection: "row", padding: 0 }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}>
                <EventIcon sx={{ width: iconPx - 8, height: iconPx - 8 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("keypoint.date")}
              secondary={new Date(props.log.start_dt * 1000).toLocaleDateString(
                "de-DE",
              )}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}>
                <DriveFileRenameOutlineIcon
                  sx={{ width: iconPx - 8, height: iconPx - 8 }}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("keypoint.project_name")}
              secondary={props.log.project_name}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}>
                <MyLocationIcon sx={{ width: iconPx - 8, height: iconPx - 8 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("keypoint.onsite")} secondary={props.log.onsite} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}>
                <ChatIcon sx={{ width: iconPx - 8, height: iconPx - 8 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("keypoint.comment")}
              secondary={props.log.comment}
            />
          </ListItem>
          <ListItem>
            <Button
              sx={{ mr: 1, mt: 1 }}
              color="error"
              onClick={() => deleteHandler(props.log.uuid)}
              disabled={props.monthIsClosed}
            >
              <DeleteForeverIcon />
            </Button>
          </ListItem>
        </List>
      </Box>
    </Card>
  );
}
