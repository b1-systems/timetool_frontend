import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { PerdiemModelsToProjectUuid } from "../../models";

export default function InputPerdiem(props: {
  uuidProject: string | null;
  projectPerdiemModelsAsObject: PerdiemModelsToProjectUuid;
  perdiemModels: string[];
  model: string;
  setModel(model: string): void;
  setTypeOfPerdiem(type: number): void;
  setLogMsg(msg: string): void;
  logMsg: string;
}) {
  const { t } = useTranslation();
  const setPerdiemModelHandler = (event: SelectChangeEvent) => {
    props.setModel(event.target.value as string);
    if (props.uuidProject) {
      for (const [key, value] of Object.entries(
        props.projectPerdiemModelsAsObject[props.uuidProject],
      )) {
        if (value === (event.target.value as string)) {
          props.setTypeOfPerdiem(parseInt(key));
        }
      }
    }
  };

  return (
    <>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-modelState">{t("model")}</InputLabel>
          <Select
            labelId="select-label-model"
            required={true}
            id="demo-simple-select-model"
            value={props.model}
            label={t("model")}
            onChange={(e) => setPerdiemModelHandler(e)}
          >
            {props.perdiemModels.map((singleType, idx) => (
              <MenuItem key={idx} value={singleType}>
                {singleType}
              </MenuItem>
            ))}
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
