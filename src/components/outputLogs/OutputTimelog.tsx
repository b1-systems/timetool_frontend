import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventIcon from "@mui/icons-material/Event";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Box, Button, Card, CardActions, Grid } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { Timelog } from "../../models";
import OutputChip from "./OutputChip";

export default function OutputTimelogs(props: {
  monthIsClosed: boolean;

  log: Timelog;
  deleteTimelog(uuid: string): void;
  index: number;
}) {
  const { t } = useTranslation();

  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype);
    props.deleteTimelog(uuid);
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
              <Grid item xs={12} sm={6} md={6} lg={1}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.from")}
                  Icon={
                    <AccessTimeIcon sx={{ width: 18, height: 18, color: "white" }} />
                  }
                  text={DateTime.fromSeconds(props.log.start_dt).toFormat("T")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={1}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.to")}
                  Icon={<MoreTimeIcon sx={{ width: 18, height: 18, color: "white" }} />}
                  text={DateTime.fromSeconds(props.log.end_dt).toFormat("T")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.comment")}
                  Icon={<ChatIcon sx={{ width: 18, height: 18, color: "white" }} />}
                  text={props.log.comment || "no comment"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={2}>
                <OutputChip
                  index={props.index}
                  heading={t("keypoint.onsite")}
                  Icon={
                    <MyLocationIcon sx={{ width: 18, height: 18, color: "white" }} />
                  }
                  text={props.log.onsite || "remote"}
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
