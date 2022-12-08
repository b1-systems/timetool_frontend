import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { Box, Button, Card, CardActions, Collapse, Grid } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { useEditUUID } from "../../atoms/edit";
import { useUpdateLogs } from "../../atoms/logs";
import { useShiftModels } from "../../atoms/projects";
import { Shift } from "../../models/internal";
import OutputChip from "./OutputChip";

export default function OutputShift(props: {
  log: Shift;
  index: number;
  monthIsClosed: boolean;
}) {
  const { t } = useTranslation();

  const [entriesVisible, setEntriesVisible] = useState<boolean>(false);

  const shiftModels = useShiftModels();
  const [, setEditUUID] = useEditUUID();

  const updateLogs = useUpdateLogs();

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

  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype)
      .then(() => updateLogs())
      .catch((errorUpdateLogs) => console.error(errorUpdateLogs));
  };

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
                index={props.index}
                heading={t("keypoint.date")}
                Icon={<EventIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={props.log.startTime.toJSDate().toLocaleDateString("de-DE")}
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
                text={shiftModelHandler(props.log.project_uuid, props.log.shiftModel)}
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
                              text={`${incident.startTime.toISODate()} ${incident.startTime.toFormat(
                                "HH':'mm':'ss",
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
                              text={`${incident.endTime.toISODate()} ${incident.endTime.toFormat(
                                "HH':'mm':'ss",
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
        {!props.monthIsClosed && props.log.uuid && (
          <>
            {!!props.log.incidents?.length && (
              <Button
                color="info"
                size="small"
                variant="contained"
                onClick={() => setEntriesVisible(!entriesVisible)}
                data-testid={`OutputTimelog_expand-info-btn_index-${props.index}`}
              >
                {entriesVisible && (
                  <ExpandLessIcon
                    data-testid={`OutputTimelog_expandLess-icon_index-${props.index}`}
                  />
                )}
                {!entriesVisible && <ExpandMoreIcon />}
              </Button>
            )}
            <Button
              color="warning"
              size="small"
              variant="contained"
              onClick={() => setEditUUID(props.log.uuid)}
              data-testid={`OutputShift_edit-warning-btn_index-${props.index}`}
            >
              <EditIcon />
            </Button>
            <Button
              color="error"
              size="small"
              variant="contained"
              onClick={() => deleteHandler(props.log.uuid ? props.log.uuid : "")}
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
