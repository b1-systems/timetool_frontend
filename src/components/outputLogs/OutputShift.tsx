import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import { Avatar, Box, Button, Card, Chip, Collapse } from "@mui/material";
import { DateTime } from "luxon";
import React, { useState } from "react";
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

  const [entriesVisible, setEntriesVisible] = useState<boolean>(true);

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
              t("keypoint.entries") +
              (props.log.incidents?.length.toString()
                ? props.log.incidents?.length.toString()
                : "0")
            }
            avatar={
              <Avatar sx={{ width: 32, height: 32 }}>
                <FilterNoneIcon sx={{ width: 18, height: 18, color: "white" }} />
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
        {!!props.log.incidents && (
          <>
            {!entriesVisible && (
              <Box
                bgcolor={props.index % 2 ? "white" : "#eeeeee"}
                onClick={() => setEntriesVisible(!entriesVisible)}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  display: "flex",
                  p: 1,
                  m: 1,
                  justifyContent: "space-evenly",
                }}
              >
                <Button fullWidth color="info">
                  <ExpandMoreIcon />
                </Button>
              </Box>
            )}
            <Collapse orientation="vertical" in={entriesVisible}>
              {props.log.incidents?.map((incident, index) => (
                <Box
                  key={index}
                  bgcolor={(props.index + index) % 2 ? "#eeeeee" : "white"}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                    display: "flex",
                    p: 1,
                    m: 1,
                    justifyContent: "space-around",
                  }}
                >
                  <Chip
                    style={{
                      backgroundColor: (props.index + index) % 2 ? "#eeeeee" : "white",
                    }}
                    label={
                      t("keypoint.from") +
                      `${DateTime.fromSeconds(incident.start_dt).day} ${
                        DateTime.fromSeconds(incident.start_dt).monthShort
                      } at: ${DateTime.fromSeconds(props.log.start_dt).toFormat("T")}`
                    }
                    avatar={
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <AccessTimeIcon
                          sx={{ width: 18, height: 18, color: "white" }}
                        />
                      </Avatar>
                    }
                  />
                  <Chip
                    style={{
                      backgroundColor: (props.index + index) % 2 ? "#eeeeee" : "white",
                    }}
                    label={
                      t("keypoint.to") +
                      `${DateTime.fromSeconds(incident.end_dt).day} ${
                        DateTime.fromSeconds(incident.end_dt).monthShort
                      } at: ${DateTime.fromSeconds(props.log.end_dt).toFormat("T")}`
                    }
                    avatar={
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <MoreTimeIcon sx={{ width: 18, height: 18, color: "white" }} />
                      </Avatar>
                    }
                  />
                  <Chip
                    style={{
                      backgroundColor: (props.index + index) % 2 ? "#eeeeee" : "white",
                    }}
                    label={t("keypoint.comment") + incident.comment}
                    avatar={
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <ChatIcon sx={{ width: 18, height: 18, color: "white" }} />
                      </Avatar>
                    }
                  />
                </Box>
              ))}
              {props.log.incidents.length >= 1 && (
                <Box
                  bgcolor={props.index % 2 ? "white" : "#eeeeee"}
                  onClick={() => setEntriesVisible(!entriesVisible)}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                    display: "flex",
                    p: 1,
                    m: 1,
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button fullWidth color="info">
                    <ExpandLessIcon />
                  </Button>
                </Box>
              )}
            </Collapse>
          </>
        )}
      </Box>
    </Card>
  );
}
