import { useToasty } from "@b1-systems/react-components";
import { DeleteForever } from "@mui/icons-material";
import { Button } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useUpdateLogs } from "../../atoms/logs";
import { deleteTimelog } from "../../lib";

const DeleteButton: FC<{ uuid: string }> = ({ uuid }) => {
    const { t } = useTranslation();
    const { toasty } = useToasty();

    const updateLogs = useUpdateLogs();

    return (
        <Button
            color="error"
            size="small"
            variant="contained"
            onClick={() =>
                deleteTimelog({ uuid })
                    .catch((err) => {
                        toasty.error(t("notification.error_while_deleting"));
                        console.error(err);
                    })
                    .finally(() => updateLogs())
            }
            data-testid="DeleteButton--button"
        >
            <DeleteForever />
        </Button>
    );
};
export default DeleteButton;
