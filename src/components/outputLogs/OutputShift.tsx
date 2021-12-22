import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { Box, Button, Card, Collapse, Grid } from "@mui/material";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { ModelsShift, Timelog } from "../../models";
import OutputChip from "./OutputChip";

export default function OutputShift(props: {
  projectShiftModelsAsObject: { [key: string]: ModelsShift };
  log: Timelog;
  index: number;
  monthIsClosed: boolean;
  deleteTimelog(uuid: string): void;
}) {
  const { t } = useTranslation();

  const [entriesVisible, setEntriesVisible] = useState<boolean>(false);

  const shiftModelHandler = (uuid: string, type: string | undefined): string => {
    if (Object.keys(props.projectShiftModelsAsObject).length !== 0 && type) {
      if (props.projectShiftModelsAsObject[uuid]) {
        for (const [key, value] of Object.entries(
          props.projectShiftModelsAsObject[uuid],
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
    props.deleteTimelog(uuid);
  };

  return (
    <Card elevation={0}>
      <Box
        bgcolor={props.index % 2 ? "white" : "#eeeeee"}
        sx={{
          flexWrap: "wrap",
          display: "flex",
          p: 1,
          m: 1,
          justifyContent: "space-evenly",
        }}
      >
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={1}
            sx={{
              borderBottom: 1,
              borderRight: 1,
              borderColor: "#bdbdbd",
            }}
          >
            <OutputChip
              index={props.index}
              heading={t("keypoint.date")}
              Icon={<EventIcon sx={{ width: 18, height: 18, color: "white" }} />}
              text={new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={3}
            sx={{
              borderBottom: 1,
              borderRight: 1,
              borderColor: "#bdbdbd",
            }}
          >
            <OutputChip
              index={props.index}
              heading={t("keypoint.project")}
              Icon={
                <DriveFileRenameOutlineIcon
                  sx={{ width: 18, height: 18, color: "white" }}
                />
              }
              text={props.log.project_name}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={3}
            sx={{
              borderBottom: 1,
              borderRight: 1,
              borderColor: "#bdbdbd",
            }}
          >
            <OutputChip
              index={props.index}
              heading={t("keypoint.type")}
              Icon={<NightsStayIcon sx={{ width: 18, height: 18, color: "white" }} />}
              text={shiftModelHandler(props.log.project_uuid, props.log.shift_model)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={2}
            sx={{
              borderBottom: 1,
              borderRight: 1,
              borderColor: "#bdbdbd",
            }}
          >
            <OutputChip
              index={props.index}
              heading={t("keypoint.entries")}
              Icon={<FilterNoneIcon sx={{ width: 18, height: 18, color: "white" }} />}
              text={
                props.log.incidents?.length.toString()
                  ? props.log.incidents?.length.toString()
                  : "0"
              }
            />
          </Grid>
          <Grid item xs={1} lg={0}></Grid>
          <Grid container item xs={12} lg={2}>
            <Grid item xs={0} lg={1}></Grid>
            <Grid item xs={5} lg={5}>
              {!!props.log.incidents?.length && (
                <Card
                  elevation={0}
                  style={{
                    backgroundColor: "#2196f3",
                    padding: 1,
                  }}
                  sx={{
                    border: 5,
                    borderColor: props.index % 2 ? "white" : "#eeeeee",
                  }}
                >
                  <Button
                    fullWidth
                    size="small"
                    sx={{ color: "white" }}
                    onClick={() => setEntriesVisible(!entriesVisible)}
                  >
                    {entriesVisible && <ExpandLessIcon />}
                    {!entriesVisible && <ExpandMoreIcon />}
                  </Button>
                </Card>
              )}
            </Grid>
            <Grid item xs={2} lg={1}></Grid>
            <Grid item xs={5} lg={5}>
              <Card
                elevation={0}
                style={{
                  backgroundColor: "#d50000",
                  padding: 1,
                }}
                sx={{
                  border: 5,
                  borderColor: props.index % 2 ? "white" : "#eeeeee",
                }}
              >
                <Button
                  fullWidth
                  size="small"
                  sx={{ color: "white" }}
                  onClick={() => deleteHandler(props.log.uuid)}
                  disabled={props.monthIsClosed}
                >
                  <DeleteForeverIcon />
                </Button>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={10}>
            {!!props.log.incidents && (
              <Collapse orientation="vertical" in={entriesVisible}>
                {props.log.incidents?.map((incident, index) => (
                  <Box
                    key={index}
                    bgcolor={(props.index + index) % 2 ? "#eeeeee" : "white"}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      flexWrap: "wrap",
                      display: "flex",
                      m: 0,
                      p: 0,
                      justifyContent: "space-around",
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        md={4}
                        lg={4}
                        sx={{
                          borderBottom: 1,
                          borderRight: 1,
                          borderColor: "#bdbdbd",
                        }}
                      >
                        <OutputChip
                          index={index + 1}
                          heading={t("keypoint.from")}
                          Icon={
                            <AccessTimeIcon
                              sx={{ width: 18, height: 18, color: "white" }}
                            />
                          }
                          text={`${DateTime.fromSeconds(incident.start_dt).day} ${
                            DateTime.fromSeconds(incident.start_dt).monthShort
                          } at: ${DateTime.fromSeconds(props.log.start_dt).toFormat(
                            "T",
                          )}`}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={3}
                        md={4}
                        lg={4}
                        sx={{
                          borderBottom: 1,
                          borderRight: 1,
                          borderColor: "#bdbdbd",
                        }}
                      >
                        <OutputChip
                          index={index + 1}
                          heading={t("keypoint.to")}
                          Icon={
                            <MoreTimeIcon
                              sx={{ width: 18, height: 18, color: "white" }}
                            />
                          }
                          text={`${DateTime.fromSeconds(incident.end_dt).day} ${
                            DateTime.fromSeconds(incident.end_dt).monthShort
                          } at: ${DateTime.fromSeconds(props.log.end_dt).toFormat(
                            "T",
                          )}`}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        sx={{
                          borderBottom: 1,
                          borderRight: 1,
                          borderColor: "#bdbdbd",
                        }}
                      >
                        <OutputChip
                          index={index + 1}
                          heading={t("keypoint.comment")}
                          Icon={
                            <ChatIcon sx={{ width: 18, height: 18, color: "white" }} />
                          }
                          text={incident.comment}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Collapse>
            )}
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
