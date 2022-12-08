import {
  Alert,
  Card,
  CardContent,
  CardHeader,
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

import { useEditTimelog } from "../../atoms/edit";
import { useSelectedProject } from "../../atoms/projects";
import { useIsMonthClosed, useSelectedDate } from "../../atoms/selectedDate";
import { useProjectWorktypes } from "../../atoms/worktype";
import InputDefaultTimelog from "./InputDefaultTimelog";
import InputPerdiem from "./InputPerdiem";
import InputShift from "./InputShift";

const InputCard = () => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useSelectedDate();
  const isMonthClosed = useIsMonthClosed();

  const [selectedProject] = useSelectedProject();

  const projectWorktypes = useProjectWorktypes();
  const [selectedWorktype, setSelectedWorktype] = useState<string>("");
  useEffect(() => {
    if (projectWorktypes?.length) {
      if (!projectWorktypes.includes(selectedWorktype!))
        setSelectedWorktype(projectWorktypes[0]);
    }
  }, [projectWorktypes, selectedWorktype, setSelectedWorktype]);

  const editTimelog = useEditTimelog();
  useEffect(() => {
    if (editTimelog) {
      setSelectedDate(editTimelog.startTime);
    } else {
      setSelectedDate(DateTime.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTimelog?.uuid, setSelectedDate]);

  console.log("render InputCard");

  if (isMonthClosed) {
    return (
      <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
        <CardContent>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("month_is_closed")}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  if (!selectedProject) {
    return (
      <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
        <CardContent>
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {t("select_a_project")}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "grey.300", ml: 1, mr: 1 }}>
      <form onSubmit={() => console.log("TODO: Submit handler")}>
        <CardHeader></CardHeader>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <FormControl fullWidth>
                <DatePicker
                  views={["day"]}
                  label={t("day")}
                  minDate={selectedDate.startOf("month")}
                  maxDate={selectedDate.endOf("month")}
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate(newValue);
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={7} md={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id="select-label-typeState">{t("type")}</InputLabel>
                <Select
                  labelId="select-label-type"
                  id="demo-simple-select-type"
                  data-testid={`InputCard_type-Select`}
                  value={selectedWorktype}
                  required={true}
                  label={t("type")}
                  disabled={!!projectWorktypes && !projectWorktypes.length}
                  onChange={(e) => setSelectedWorktype(e.target.value)}
                >
                  {projectWorktypes &&
                    projectWorktypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {selectedWorktype && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {selectedWorktype === "timelog" && (
                <InputDefaultTimelog types={projectWorktypes!} />
              )}
              {selectedWorktype === "perdiem" && (
                <InputPerdiem types={projectWorktypes!} />
              )}
              {selectedWorktype === "shift" && <InputShift types={projectWorktypes!} />}
            </Grid>
          )}
        </CardContent>
      </form>
    </Card>
  );
};
export default InputCard;
