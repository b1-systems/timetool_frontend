import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Card } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { Timelog } from "../../models";

export default function OutputTimelogs(props: {
  monthIsClosed: boolean;
  log: Timelog;
  deleteTimelog(uuid: string): void;
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
    <Card elevation={0} sx={{ border: 1, borderColor: "grey.300" }}>
      <li>
        {t("keypoint.date")}
        {new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}{" "}
        {t("keypoint.project_name")}
        {props.log.project_name} {t("keypoint.comment")} {props.log.comment}{" "}
        {t("keypoint.onsite")} {props.log.onsite}
        <Button
          onClick={() => deleteHandler(props.log.uuid)}
          disabled={props.monthIsClosed}
        >
          <DeleteForeverIcon />
        </Button>
      </li>
    </Card>
  );
}
