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

const MonthEndDialog = (props: {
  close: () => void;
  selectedMonth: Date | null;
}) => {
  const cancelHandler = async () => {
    props.close();
  };

  const handleEndMonth = () => {
    const request = {
      date: props.selectedMonth,
    };
    console.log(
      'prototyp API call',
      'POST',
      '/rest/:date/:project',
      'Body json:',
      request,
    );
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
            size='small'
            startIcon={<ClearIcon />}
            data-testid='KeyDialog_close-btn'
          >
            no
          </Button>
          <Button
            sx={{ml: 1, mb: 2, mt: 2}}
            size='small'
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
