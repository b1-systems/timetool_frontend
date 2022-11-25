import { NoteAdd } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { alertShownInInputState } from "../../atom";
import { useIsMonthClosed, useSelectedDate } from "../../atoms/selectedDate";

interface SubmitButtonsProps {
  submit: () => void;
}
const SubmitButtons: FC<SubmitButtonsProps> = ({ submit }) => {
  const { t } = useTranslation();

  const isMonthClosed = useIsMonthClosed();
  const alertShownInInput = useRecoilValue(alertShownInInputState);
  const [, setSelectedDate] = useSelectedDate();

  // TODO: debounce buttons

  return (
    <>
      <Grid item xs={12}>
        <Button
          sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
          size="large"
          variant="contained"
          startIcon={<NoteAdd />}
          type="submit"
          onClick={(ev) => {
            ev.preventDefault();
            submit();
            setSelectedDate((date) => date.plus({ days: 1 }));
          }}
          disabled={isMonthClosed || alertShownInInput}
          data-testid={"InputCard_commit-info-btn_index"}
        >
          {t("commit_&_next_day")}
        </Button>
        <Button
          sx={{ mt: 3, mb: 2, ml: 1, mr: 1 }}
          size="large"
          variant="contained"
          startIcon={<NoteAdd />}
          type="submit"
          onClick={(ev) => {
            ev.preventDefault();
            submit();
          }}
          disabled={isMonthClosed || alertShownInInput}
          data-testid={"InputCard_commit-stay_date-btn_index"}
        >
          {t("commit_&_same_day")}
        </Button>
      </Grid>
    </>
  );
};
export default SubmitButtons;
