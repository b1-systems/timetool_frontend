import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import { Box, Button, Card, CardActions, Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { fetchDelete } from "../../api";
import { editTimelogState, perdiemModelsState, useUpdateLogs } from "../../atom";
import { Timelog } from "../../models";
import OutputChip from "./OutputChip";

export default function OutputPerdiem(props: {
  monthIsClosed: boolean;
  log: Timelog;
  index: number;
}) {
  const { t } = useTranslation();
  const setEditTimelog = useSetRecoilState(editTimelogState);
  const updateLogs = useUpdateLogs();

  const perdiemModels = useRecoilValue(perdiemModelsState);

  const perdiemModelHandler = (uuid: string, type: number): string => {
    if (perdiemModels.size !== 0 && type) {
      if (perdiemModels.has(uuid)) {
        const perdiem = perdiemModels.get(uuid);
        if (!perdiem) {
          return "unknown type";
        }
        for (const [key, value] of Object.entries(perdiem)) {
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

  const editHandler = (log: Timelog) => {
    setEditTimelog(log);
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
                lg={2}
                index={props.index}
                heading={t("keypoint.date")}
                Icon={<EventIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}
              />
              <OutputChip
                lg={3}
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
                lg={3}
                index={props.index}
                heading={t("keypoint.type")}
                Icon={<PaidIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={perdiemModelHandler(
                  props.log.project_uuid,
                  typeof props.log.type === "number" ? props.log.type : -1,
                )}
              />
              <OutputChip
                lg={4}
                index={props.index}
                heading={t("keypoint.comment")}
                Icon={<ChatIcon sx={{ width: 18, height: 18, color: "white" }} />}
                text={props.log.comment || "no comment"}
              />
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <CardActions>
        {!props.monthIsClosed && (
          <>
            <Button
              color="warning"
              size="small"
              variant="contained"
              onClick={() => editHandler(props.log)}
              data-testid={`OutputPerdiem_edit-warning-btn_index-${props.index}`}
            >
              <EditIcon />
            </Button>
            <Button
              color="error"
              size="small"
              variant="contained"
              onClick={() => deleteHandler(props.log.uuid)}
              disabled={props.monthIsClosed}
              data-testid={`OutputPerdiem_delete-error-btn`}
            >
              <DeleteForeverIcon />
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
