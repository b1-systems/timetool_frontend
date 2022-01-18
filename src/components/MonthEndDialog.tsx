import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { fetchCloseMonth, fetchIsMonthClosed } from "../api";
import { dateFromState } from "../atom";

const MonthEndDialog = (props: {
  setMonthIsClosed(isClosed: boolean): void;
  close: () => void;
}) => {
  const { t } = useTranslation();
  const cancelHandler = async () => {
    props.close();
  };

  const [dateFrom] = useRecoilState(dateFromState);

  const handleEndMonth = () => {
    fetchCloseMonth({
      request: {
        year: dateFrom.year.toString(),
        month: dateFrom.month.toString(),
        format: "traditional",
        scope: "me",
      },
    });
    fetchIsMonthClosed({
      params: {
        year: dateFrom.year,
        month: dateFrom.month,
        format: "traditional",
        scope: "me",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.locks.length === 0) {
          props.setMonthIsClosed(false);
        } else {
          props.setMonthIsClosed(true);
        }
      });
    cancelHandler();
  };

  return (
    <Dialog onClose={cancelHandler} open={true}>
      <Box
        sx={{
          mt: 1,
          mb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DialogContent>
          <Typography variant="h6" component="div" align="center">
            {t(
              "question_the_closing_of_this_month_is_irreversible_do_you_still_want_to_continue",
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelHandler}
            sx={{ mr: 1, mb: 2, mt: 2 }}
            startIcon={<CancelPresentationOutlinedIcon />}
            data-testid="KeyDialog_close-btn"
          >
            {t("no")}
          </Button>
          <Button
            sx={{ ml: 1, mb: 2, mt: 2 }}
            startIcon={<CheckBoxIcon />}
            onClick={handleEndMonth}
            data-testid="KeyDialog_next-btn"
          >
            {t("yes")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MonthEndDialog;
