import { NoteAdd } from "@mui/icons-material";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { submitPerdiem } from "../../api";

import {
  alertShownInInputState,
  perdiemModelsState,
  selectedProjectState,
} from "../../atom";
import { useSelectedDate } from "../../atoms/selectedDate";
import { Perdiem, isPerdiem } from "../../models";

export default function InputPerdiem(props: {
  types: string[];
  perdiemTimelog: Perdiem;
  setPerdiemTimelog(timelog: Perdiem): void;
}) {
  const { t } = useTranslation();

  const project = useRecoilValue(selectedProjectState);
  const perdiemModels = useRecoilValue(perdiemModelsState);
  const projectPerdiemModels = project ? perdiemModels.get(project.uuid) : {};

  // default to current date
  const [selectedDate, setSelectedDate] = useSelectedDate();
  const [selectedModel, setSelectedModel] = useState(-1);
  const [comment, setComment] = useState("");
  useEffect(
    () => {
      // if the uuid is changed
      // or editing is cancelled
      // change the input values accordingly
    },
    [
      /* editUUID */
    ],
  );

  const submit = ({ advanceDate }: { advanceDate: boolean }) => {
    // Do API call
    submitPerdiem({
      start_dt: parseInt(selectedDate.toSeconds()/1000),
      comment: comment,
      is_perdiem: true,
      project_uuid: project!.uuid,
      timezone: selectedDate.zone.,
      type: selectedModel,
      uuid: ""
    })

    if (advanceDate) setSelectedDate((value) => value.plus({ days: 1 }));
  };

  const setAlertShownInInput = useSetRecoilState(alertShownInInputState);
  if (!props.types.includes("perdiem")) {
    setAlertShownInInput(true);
    return (
      <Container>
        <Box sx={{ mx: "auto", textAlign: "center", p: 5 }}>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("no_perdiems_in_this_project")}
          </Alert>
        </Box>
      </Container>
    );
  }
  setAlertShownInInput(false);

  return (
    <>
      {/* Perdiem Model Selection */}
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <FormControl fullWidth>
          <InputLabel id="select-label-modelState">{t("model")}</InputLabel>
          <Select
            labelId="select-label-model"
            required={true}
            id="demo-simple-select-model"
            value={selectedModel.toString()}
            label={t("model")}
            onChange={(e) => setSelectedModel(parseInt(e.target.value))}
          >
            {projectPerdiemModels &&
              Object.entries(projectPerdiemModels).map(([key, perdiemModel]) => (
                <MenuItem key={key} value={key}>
                  {perdiemModel}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Comment Input */}
      <Grid item xs={12} sm={7} md={6} lg={4}>
        <TextField
          fullWidth
          label={t("comment")}
          required={true}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Grid>

      {/* Cancel Editing Button */}
      {props.perdiemTimelog.uuid && (
        <Grid item xs={12} sm={6} md={3} lg={2} sx={{ mt: 1 }}>
          <Button
            color="warning"
            fullWidth
            size="large"
            onClick={() => {
              props.setPerdiemTimelog({ ...props.perdiemTimelog, uuid: null });
            }}
            variant="contained"
            data-testid={`InputPerdiem_cancel_edit-warning-btn`}
            startIcon={<DoDisturbIcon />}
          >
            {t("cancel_edit")}
          </Button>
        </Grid>
      )}

      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Button
          fullWidth
          sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
          size="large"
          variant="contained"
          startIcon={<NoteAdd />}
          type="submit"
          onClick={() => submit({ advanceDate: true })}
          disabled={props.monthIsClosed || submitBtnDisabled || alertShownInInput}
          data-testid={"InputCard_commit-info-btn_index"}
        >
          {t("commit_&_next_day")}
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Button
          fullWidth
          sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
          size="large"
          variant="contained"
          startIcon={<NoteAdd />}
          type="submit"
          onClick={() => submit({ advanceDate: false })}
          disabled={props.monthIsClosed || submitBtnDisabled || alertShownInInput}
          data-testid={"InputCard_commit-stay_date-btn_index"}
        >
          {t("commit_&_same_day")}
        </Button>
      </Grid>
    </>
  );
}
