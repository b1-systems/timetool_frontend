import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Card } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { fetchDelete } from "../../api";
import { Perdiem } from "../../models";

export default function OutputPerdiem(props: {
  monthIsClosed: boolean;
  log: Perdiem;
  deletePerdiem(uuid: string): void;
}) {
  const { t } = useTranslation();
  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: { uuid: uuid },
    };
    fetchDelete(requestPrototype);
    props.deletePerdiem(uuid);
  };
  const logTypeHandler = (type: number) => {
    switch (type) {
      case 4:
        return "VMA Ausland";
      case 5:
        return "32 € 24h ab 3 Mon";
      case 6:
        return "16 € Anreise ab 3 Mon";
      case 7:
        return "14 € VMA Anreise";
      case 8:
        return "28 € VMA 24h";
      default:
        return "unknown type";
    }
  };
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "grey.300" }}>
      <li>
        {t("keypoint.date")}
        {new Date(props.log.start_dt * 1000).toLocaleDateString("de-DE")}{" "}
        {t("keypoint.project_name")} {props.log.project_name} {t("keypoint.typ")}
        {logTypeHandler(props.log.type)} {t("keypoint.comment")} {props.log.comment}
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
