import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function InputPerdiem(props: {
  projectPerdiemtModelsAsObject: Object;
  setTypeOfPerdiem(type: number): void;
  setLogMsg(msg: string): void;
  logMsg: string;
}) {
  const { t } = useTranslation();
  const [model, setModel] = useState<string>(
    Object.values(props.projectPerdiemtModelsAsObject)[0],
  );
  const perdiemModelHandler = (model: string) => {
    switch (model) {
      case "VMA Ausland":
        props.setTypeOfPerdiem(4);
        break;
      case "32 € 24h ab 3 Mon":
        props.setTypeOfPerdiem(5);
        break;
      case "16 € Anreise ab 3 Mon":
        props.setTypeOfPerdiem(6);
        break;
      case "14 € VMA Anreise":
        props.setTypeOfPerdiem(7);
        break;
      case "28 € VMA 24h":
        props.setTypeOfPerdiem(8);
        break;
      default:
        props.setTypeOfPerdiem(-1);
    }
  };

  const setModelHandler = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
    perdiemModelHandler(event.target.value as string);
  };

  return (
    <>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-modelState">{t("model")}</InputLabel>
          <Select
            labelId="select-label-model"
            id="demo-simple-select-model"
            value={model}
            label={t("model")}
            onChange={setModelHandler}
          >
            {Object.values(props.projectPerdiemtModelsAsObject).map(
              (singleModel, idx) => (
                <MenuItem key={idx} value={singleModel}>
                  {singleModel}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={7} md={6} lg={4}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={props.logMsg}
          onChange={(e) => props.setLogMsg(e.target.value)}
        />
      </Grid>
    </>
  );
}
