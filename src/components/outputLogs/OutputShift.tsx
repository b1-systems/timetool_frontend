import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import {
  Avatar,
  Box,
  Button,
  Card,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { Timelog } from "../../models";

export default function OutputShift(props: {
  log: Timelog;
  index: number;
  monthIsClosed: boolean;
  deleteTimelog(uuid: string): void;
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

  const [entriesVisible, setEntriesVisible] = useState<boolean>(true);
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
                <FilterNoneIcon sx={{ width: iconPx - 8, height: iconPx - 8 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("keypoint.entries")}
              secondary={
                props.log.incidents?.length.toString()
                  ? props.log.incidents?.length.toString()
                  : "0"
              }
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

        {!!props.log.incidents && (
          <>
            {!entriesVisible && (
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
                onClick={() => setEntriesVisible(!entriesVisible)}
              >
                <ListItem>
                  <ExpandMoreIcon color="info" />
                </ListItem>
                <ListItem>
                  <ExpandMoreIcon color="info" />
                </ListItem>
                <ListItem>
                  <ExpandMoreIcon color="info" />
                </ListItem>
                <ListItem>
                  <ExpandMoreIcon color="info" />
                </ListItem>
              </List>
            )}
            <Collapse orientation="vertical" in={entriesVisible}>
              {props.log.incidents?.map((incident, index) => (
                <Box
                  bgcolor={(props.index + index) % 2 ? "#eeeeee" : "white"}
                  key={index}
                >
                  <List style={{ display: "flex", flexDirection: "row", padding: 0 }}>
                    <ListItem />
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}
                        >
                          <AccessTimeIcon
                            sx={{ width: iconPx - 8, height: iconPx - 8 }}
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={t("keypoint.from")}
                        secondary={`${DateTime.fromSeconds(incident.start_dt).day} ${
                          DateTime.fromSeconds(incident.start_dt).monthShort
                        } at: ${DateTime.fromSeconds(incident.start_dt).hour} : ${
                          DateTime.fromSeconds(incident.start_dt).minute
                        }`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}
                        >
                          <MoreTimeIcon
                            sx={{ width: iconPx - 8, height: iconPx - 8 }}
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={t("keypoint.to")}
                        secondary={`${DateTime.fromSeconds(incident.end_dt).day}. ${
                          DateTime.fromSeconds(incident.end_dt).monthLong
                        } at: ${DateTime.fromSeconds(incident.end_dt).hour}:${
                          DateTime.fromSeconds(incident.end_dt).minute
                        }`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: iconPx, height: iconPx, mt: iconMarginTop }}
                        >
                          <ChatIcon sx={{ width: iconPx - 8, height: iconPx - 8 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={t("keypoint.comment")}
                        secondary={incident.comment}
                      />
                    </ListItem>
                  </List>
                </Box>
              ))}
              {props.log.incidents.length >= 1 && (
                <List
                  style={{ display: "flex", flexDirection: "row", padding: 0 }}
                  onClick={() => setEntriesVisible(!entriesVisible)}
                >
                  <ListItem />
                  <ListItem>
                    <ExpandLessIcon color="info" />
                  </ListItem>
                  <ListItem>
                    <ExpandLessIcon color="info" />
                  </ListItem>
                  <ListItem>
                    <ExpandLessIcon color="info" />
                  </ListItem>
                </List>
              )}
            </Collapse>
          </>
        )}
      </Box>
    </Card>
  );
}
