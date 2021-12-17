import { DateTime } from 'luxon';

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Typography,
} from '@mui/material';

import { fetchCloseMonth } from '../api';

const MonthEndDialog = (props: {
  close: () => void;
  selectedMonth: DateTime;
}) => {
  const cancelHandler = async () => {
    props.close();
  };

  const handleEndMonth = () => {
    fetchCloseMonth({
      request: {
        year: props.selectedMonth.year.toString(),
        month: props.selectedMonth.month.toString(),
        format: 'traditional',
        scope: 'me',
      },
    });
    cancelHandler();
  };

  return (
    <Dialog onClose={cancelHandler} open={true}>
      <Box
        sx={{
          mt: 1,
          mb: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <DialogContent>
          <Typography variant='h6' component='div' align='center'>
            The closing of this month is irreversible. Do you still want to
            continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelHandler}
            sx={{mr: 1, mb: 2, mt: 2}}
            startIcon={<ClearIcon />}
            data-testid='KeyDialog_close-btn'
          >
            no
          </Button>
          <Button
            sx={{ml: 1, mb: 2, mt: 2}}
            startIcon={<AddIcon />}
            onClick={handleEndMonth}
            data-testid='KeyDialog_next-btn'
          >
            yes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MonthEndDialog;
