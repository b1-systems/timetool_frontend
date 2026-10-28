import { useToasty } from "@b1-systems/react-components";
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
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useUpdateIsMonthClosed } from "../atoms/monthClosed";
import { useSelectedMonth } from "../atoms/selectedDate";
import { closeMonth } from "../lib";

const MonthEndDialog: FC<{ close: () => void }> = ({ close }) => {
    const { t } = useTranslation();
    const { toasty } = useToasty();

    const [selectedMonth] = useSelectedMonth();
    const updateIsMonthClosed = useUpdateIsMonthClosed();

    const endMonth = () => {
        closeMonth({ month: selectedMonth })
            .then(close)
            .catch((err) => {
                toasty.error(t("notification.error_while_ending_month"));
                console.error(err);
            })
            .finally(() => updateIsMonthClosed());
    };

    return (
        <Dialog onClose={close} open={true}>
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
                        {t("you_are_closing")}
                    </Typography>
                    <Typography variant="h6" component="div" align="center">
                        {selectedMonth.year} {selectedMonth.monthLong}
                    </Typography>
                    <Typography variant="h6" component="div" align="center">
                        {t(
                            "question_the_closing_of_this_month_is_irreversible_do_you_still_want_to_continue",
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={close}
                        sx={{ mr: 1, mb: 2, mt: 2 }}
                        startIcon={<CancelPresentationOutlinedIcon />}
                        data-testid="MonthEndDialog--button--no"
                    >
                        {t("no")}
                    </Button>
                    <Button
                        sx={{ ml: 1, mb: 2, mt: 2 }}
                        startIcon={<CheckBoxIcon />}
                        onClick={endMonth}
                        data-testid="MonthEndDialog--button--yes"
                    >
                        {t("yes")}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default MonthEndDialog;
