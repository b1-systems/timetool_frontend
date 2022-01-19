import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { perdiemModelsState } from "../../atom";

export default function InputPerdiem(props: {
  uuidProject: string;
  perdiemModels: string[];
  model: string;
  setModel(model: string): void;
  setTypeOfPerdiem(type: number): void;
  setLogMsg(msg: string): void;
  logMsg: string;
}) {
  const perdiemModels = useRecoilValue(perdiemModelsState);
  const [modelSelected, setModelSelected] = useState(props.model);
  const { t } = useTranslation();

  const projectPerdiem = perdiemModels.get(props.uuidProject);
  if (!projectPerdiem) {
    return <p>has no perdiems</p>;
  }
  return (
    <>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-modelState">{t("model")}</InputLabel>
          <Select
            labelId="select-label-model"
            required={true}
            id="demo-simple-select-model"
            value={modelSelected}
            label={t("model")}
            onChange={(e) => {
              props.setTypeOfPerdiem(parseInt(e.target.value));
              setModelSelected(e.target.value);
            }}
          >
            {Object.entries(projectPerdiem).map(([key, perdiemModel]) => (
              <MenuItem key={key} value={key}>
                {perdiemModel}
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
