import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Card } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { Timelog } from "../../models";

export default function OutputShift(props: {
  log: Timelog;
  monthIsClosed: boolean;
  deleteTimelog(uuid: string): void;
}) {
  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype);
    props.deleteTimelog(uuid);
  };
  const { t } = useTranslation();
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "grey.300" }}>
      <li>
        {t("keypoint.date")}
        {new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}{" "}
        {t("keypoint.project_name")}
        {props.log.project_name}
        <Button
          onClick={() => deleteHandler(props.log.uuid)}
          disabled={props.monthIsClosed}
        >
          <DeleteForeverIcon />
        </Button>
      </li>
      {!!props.log.incidents &&
        props.log.incidents?.map((incident, index) => (
          <>
            <div key={index}>
              {t("keypoint.from")}
              {new Date(incident.start_dt * 1000).toLocaleDateString("de-DE")}{" "}
              {t("keypoint.at")}
              {new Date(incident.start_dt * 1000).toLocaleTimeString("de-DE")}{" "}
              {t("keypoint.to")}
              {new Date(incident.end_dt * 1000).toLocaleDateString("de-DE")}{" "}
              {t("keypoint.at")}
              {new Date(incident.end_dt * 1000).toLocaleTimeString("de-DE")}
            </div>
            <div>
              {t("keypoint.comment")}
              {incident.comment}
            </div>
          </>
        ))}
    </Card>
  );
}
