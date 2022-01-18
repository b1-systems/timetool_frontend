import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import { Box, Button, Card, CardActions, Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { fetchDelete } from "../../api";
import { perdiemModelsState, useUpdateProjects } from "../../atom";
import { Perdiem } from "../../models";
import OutputChip from "./OutputChip";

export default function OutputPerdiem(props: {
  monthIsClosed: boolean;
  log: Perdiem;
  index: number;
}) {
  const { t } = useTranslation();

  const updateProjects = useUpdateProjects();

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

  //const perdiemModelHandler = (uuid: string, type: number): string => {
  //if (Object.keys(props.projectPerdiemtModelsAsObject).length !== 0) {
  //  if (props.projectPerdiemtModelsAsObject[uuid]) {
  //       for (const [key, value] of Object.entries(
  //         props.projectPerdiemtModelsAsObject[uuid],
  //       )) {
  //         if (key === type.toString()) {
  //           return value;
  //         }
  //       }
  //     }
  //   }
  //   return "unknown type";
  // };

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
                text={perdiemModelHandler(props.log.project_uuid, props.log.type)}
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
          <Button
            color="error"
            size="small"
            variant="contained"
            onClick={() => deleteHandler(props.log.uuid)}
            disabled={props.monthIsClosed}
          >
            <DeleteForeverIcon />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
