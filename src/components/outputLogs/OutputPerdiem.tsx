import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import { Box, Button, Card, CardActions, Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { ModelsPerdiem, Perdiem } from "../../models";
import OutputChip from "./OutputChip";

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
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6} md={6} lg={2}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.date")}
                  Icon={<EventIcon sx={{ width: 18, height: 18, color: "white" }} />}
                  text={new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
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
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.type")}
                  Icon={<PaidIcon sx={{ width: 18, height: 18, color: "white" }} />}
                  text={perdiemModelHandler(props.log.project_uuid, props.log.type)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.comment")}
                  Icon={<ChatIcon sx={{ width: 18, height: 18, color: "white" }} />}
                  text={props.log.comment || "no comment"}
                />
              </Grid>
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
