import { Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { FC } from "react";

import { useEditUUID } from "../../atoms/edit";

const EditButton: FC<{ uuid: string }> = ({ uuid }) => {
    const [, setEditUUID] = useEditUUID();

    return (
        <Button
            color="warning"
            size="small"
            variant="contained"
            onClick={() => setEditUUID(uuid)}
            data-testid="EditButton--button"
        >
            <Edit />
        </Button>
    );
};
export default EditButton;
