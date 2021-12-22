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

import { PerdiemModelsToProjectUuid } from "../../models";

export default function InputPerdiem(props: {
  projectPerdiemtModelsAsObject: PerdiemModelsToProjectUuid;
  setTypeOfPerdiem(type: number): void;
  setLogMsg(msg: string): void;
  logMsg: string;
  uuidProject: string | null;
}) {
  const { t } = useTranslation();
  const [model, setModel] = useState<string>("");
  const setPerdiemModelHandler = (event: SelectChangeEvent) => {
    if (props.uuidProject) {
      for (const [key, value] of Object.entries(
        props.projectPerdiemtModelsAsObject[props.uuidProject],
      )) {
        if (value === (event.target.value as string)) {
          console.log("-key:", key, "-value:", value);
          props.setTypeOfPerdiem(parseInt(key));
          setModel(value);
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
            value={model}
            label={t("model")}
            onChange={(e) => setPerdiemModelHandler(e)}
          >
            {props.uuidProject &&
              Object.values(props.projectPerdiemtModelsAsObject[props.uuidProject]).map(
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
