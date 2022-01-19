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
import { Box, Button, Card, CardActions, Collapse, Grid } from "@mui/material";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { fetchDelete } from "../../api";
import { shiftModelsState, useUpdateProjects } from "../../atom";
import { Timelog } from "../../models";
import OutputChip from "./OutputChip";

export default function OutputShift(props: {
  log: Timelog;
  index: number;
  monthIsClosed: boolean;
}) {
  const { t } = useTranslation();

  const [entriesVisible, setEntriesVisible] = useState<boolean>(false);

  const shiftModels = useRecoilValue(shiftModelsState);

  const shiftModelHandler = (uuid: string, type: string | undefined): string => {
    if (shiftModels.size !== 0 && type) {
      if (shiftModels.has(uuid)) {
        const shift = shiftModels.get(uuid);
        if (!shift) {
          return "unknown type";
        }
        for (const [key, value] of Object.entries(shift)) {
          if (key === type.toString()) {
            return value;
          }
        }
      }
    }
    return "unknown type";
  };

  const updateProjects = useUpdateProjects();

  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype).then(() => updateProjects());
  };

  return (
    <Card elevation={0} sx={{ backgroundColor: props.index % 2 ? "white" : "#eeeeee" }}>
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
                index={props.index}
                heading={t("keypoint.date")}
                Icon={<EventIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}
              />
              <OutputChip
                lg={4}
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
                lg={4}
                index={props.index}
                heading={t("keypoint.type")}
                Icon={<NightsStayIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={shiftModelHandler(props.log.project_uuid, props.log.shift_model)}
              />
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
              {!!props.log.incidents && (
                <>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={10}>
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
                          <Grid container spacing={0} alignItems="stretch">
                            <OutputChip
                              md={4}
                              lg={4}
                              index={index + 1}
                              heading={t("keypoint.from")}
                              Icon={
                                <AccessTimeIcon
                                  sx={{ width: 18, height: 18, color: "white" }}
                                />
                              }
                              text={`${DateTime.fromSeconds(incident.start_dt).day} ${
                                DateTime.fromSeconds(incident.start_dt).monthShort
                              } at: ${DateTime.fromSeconds(incident.start_dt).toFormat(
                                "T",
                              )}`}
                            />
                            <OutputChip
                              md={4}
                              lg={4}
                              index={index + 1}
                              heading={t("keypoint.to")}
                              Icon={
                                <MoreTimeIcon
                                  sx={{ width: 18, height: 18, color: "white" }}
                                />
                              }
                              text={`${DateTime.fromSeconds(incident.end_dt).day} ${
                                DateTime.fromSeconds(incident.end_dt).monthShort
                              } at: ${DateTime.fromSeconds(incident.end_dt).toFormat(
                                "T",
                              )}`}
                            />

                            <OutputChip
                              md={4}
                              lg={4}
                              index={index + 1}
                              heading={t("keypoint.comment")}
                              Icon={
                                <ChatIcon
                                  sx={{ width: 18, height: 18, color: "white" }}
                                />
                              }
                              text={incident.comment}
                            />
                          </Grid>
                        </Box>
                      ))}
                    </Collapse>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <CardActions>
        {!props.monthIsClosed && (
          <>
            {!!props.log.incidents?.length && (
              <Button
                color="info"
                size="small"
                variant="contained"
                onClick={() => setEntriesVisible(!entriesVisible)}
              >
                {entriesVisible && <ExpandLessIcon />}
                {!entriesVisible && <ExpandMoreIcon />}
              </Button>
            )}
            <Button
              color="error"
              size="small"
              variant="contained"
              onClick={() => deleteHandler(props.log.uuid)}
              disabled={props.monthIsClosed}
            >
              <DeleteForeverIcon />
            </Button>
          </>
        )}
        {props.monthIsClosed && !!props.log.incidents?.length && (
          <Button
            color="info"
            size="small"
            variant="contained"
            onClick={() => setEntriesVisible(!entriesVisible)}
          >
            {entriesVisible && <ExpandLessIcon />}
            {!entriesVisible && <ExpandMoreIcon />}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
