import { useToasty } from "@b1-systems/react-components";
import { NoteAdd } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { alertShownInInputState } from "../../atom";
import { useEditUUID } from "../../atoms/edit";
import { useIsMonthClosed, useSelectedDate } from "../../atoms/selectedDate";
import { useUpdateLogs } from "../../atoms/logs";

interface SubmitButtonsProps {
  submit: () => Promise<void>;
}
const SubmitButtons: FC<SubmitButtonsProps> = ({ submit }) => {
  const { t } = useTranslation();
  const { toasty } = useToasty();

  const isMonthClosed = useIsMonthClosed();
  const alertShownInInput = useRecoilValue(alertShownInInputState);
  const [, setSelectedDate] = useSelectedDate();
  const [busy, setBusy] = useState(false);
  const [editUUID, setEditUUID] = useEditUUID();
  const updateLogs = useUpdateLogs();

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
            setBusy(true);
            submit()
              .then(() => setSelectedDate((date) => date.plus({ days: 1 })))
              .then(() => editUUID && setEditUUID(null))
              .catch((err) => {
                toasty.error(t("notification.error_while_submitting"));
                console.error(err);
              })
              .finally(() => updateLogs())
              .finally(() => setBusy(false));
          }}
          disabled={isMonthClosed || alertShownInInput || busy}
          data-testid="SubmitButtons--CommitAndNextDay"
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
            setBusy(true);
            submit()
              .then(() => editUUID && setEditUUID(null))
              .catch((err) => {
                toasty.error(t("notification.error_while_submitting"));
                console.error(err);
              })
              .finally(() => updateLogs())
              .finally(() => setBusy(false));
          }}
          disabled={isMonthClosed || alertShownInInput || busy}
          data-testid="SubmitButtons--CommitAndSameDay"
        >
          {t("commit_&_same_day")}
        </Button>
      </Grid>
    </>
  );
};
export default SubmitButtons;
