import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import * as React from 'react';
import DatePicker from 'react-datepicker';

import {
	Alert,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { fetchVacRequest } from '../api';
import Review from './Review';

const steps = ['Daten Angeben', 'QR-Code'];

const vaccines = [
  'BioNTech', 'Moderna', 'AstraZeneca', 'Johnson&Johnson'
];

const theme = createTheme();
export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);

  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [vac, setVac] = React.useState('');
  const [vacState, setVacState] = React.useState('');
  const [date, setDate] = React.useState<Date | null>(new Date());
  const [error, setError] = React.useState('');

  const [respName, setRespName] = React.useState('');
  const [respDate, setRespDate] = React.useState(0);
  const [respId, setRespId] = React.useState('');

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const diffDays = () => {
    if (date !== null) {
      const dateNow = new Date();
      let differDays = Math.ceil(
        Math.abs(date.getTime() - dateNow.getTime()) / (1000 * 3600 * 24),
      );
      if (differDays === undefined) {
        differDays = 0;
      }
      return differDays;
    }
    return 0;
  };

  const backHandler = () => {
    setOpen(false);
    setFirstname('');
    setLastname('');
    setVac('');
    setVacState('');
    setDate(new Date());
    setError('');
    setRespName('');
    setRespDate(0);
    setRespId('');
    setActiveStep(0);
  };

  const vacDate = () => {
    if (date !== null) {
      return date.getTime();
    }
    return new Date().getTime();
  };

  const handleChangeVacState = (event: SelectChangeEvent) => {
    setVacState(event.target.value as string);
  };

  const handleChangeVac = (event: SelectChangeEvent) => {
    setVac(event.target.value as string);
  };

  const fetchAndHandleResponse = (request: any) => {
    fetchVacRequest(request)
    .then((response) => {
      return response.json();
    })
    .then((respData) => {
      if (respData && respData.ticket) {
        setRespName(request.firstname + ' ' + request.lastname);
        setRespDate(respData.ticket.date);
        setRespId(respData.ticket.id);
        setError('');
        setActiveStep(activeStep + 1);
      } else if (respData && respData.error) {
        setError(respData.error);
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.');
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let request = {
      firstname: firstname,
      lastname: lastname,
      vacState: vacState,
      vac: vac,
      date: Math.round(vacDate() / 1000),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (vacState === 'ungeimpft') {
      fetchAndHandleResponse(request);
    }
    if (vacState === 'erste Impfung erhalten') {
      if (vac === 'Johnson&Johnson') {
        setError(
          'Johnson&Johnson hat nur eine Impfdosis, sollten Sie geimpft wurden sein wählen sie bitte "durchgeimpft".',
        );
      }
      if (diffDays() >= 28) {
        fetchAndHandleResponse(request);
      } else {
        setError(
          'Bis zur Boosterimpfung müssen mindestens 28 Tage vergangen sein.',
        );
      }
    } else if (vacState === 'durchgeimpft') {
      if (vac === 'Johnson&Johnson') {
        if (diffDays() >= 28) {
          fetchAndHandleResponse(request);
        } else {
          setError(
            'Eine BoosterImpfung fällt bei Johnson&Johnson erst nach frühstens 28 Tagen an.',
          );
        }
      } else {
        if (diffDays() >= 182) {
          fetchAndHandleResponse(request);
        } else {
          setError('Eine Booster Impfung fällt erst nach einem halben Jahr an.');
        }
      }
    }
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id='firstName'
                  name='firstName'
                  label='Vorname'
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  value={firstname}
                  fullWidth
                  autoComplete='given-name'
                  variant='standard'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id='lastName'
                  name='lastName'
                  label='Nachname'
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  value={lastname}
                  fullWidth
                  autoComplete='family-name'
                  variant='standard'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='select-label-vacState'>Impfstoff</InputLabel>
                  <Select
                    labelId='select-label-vac'
                    id='demo-simple-select-vac'
                    value={vac}
                    label='Impfstoff'
                    onChange={handleChangeVac}
                  >
                    {
                      vaccines.map((v, idx)=>
                        <MenuItem key={idx} value={v}>{v}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='select-label-vacState'>Impfstatus</InputLabel>
                  <Select
                    labelId='select-label-vacState'
                    id='demo-simple-select-vacState'
                    value={vacState}
                    label='Impfstatus'
                    onChange={handleChangeVacState}
                  >
                    <MenuItem value='ungeimpft'>ungeimpft</MenuItem>
                    <MenuItem value='durchgeimpft'>durchgeimpft</MenuItem>
                    <MenuItem value='erste Impfung erhalten'>
                      erste Impfung erhalten
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                {vacState !== 'ungeimpft' && (
                  <div className='picker'>
                    <Typography style={{color: '#838282'}}>
                      Datum der letzten Impfung *
                    </Typography>
                    <DatePicker
                      id='datePicker'
                      wrapperClassName='datePicker'
                      dateFormat='dd/MM/yyyy'
                      selected={date}
                      minDate={new Date('2020-01-01')}
                      maxDate={new Date()}
                      showYearDropdown
                      scrollableMonthYearDropdown
                      onChange={(newDate: Date | null) => setDate(newDate)}
                    ></DatePicker>
                  </div>
                )}
              </Grid>
            </Grid>
            <Button variant='contained' type='submit' sx={{mt: 3, ml: 1}}>
              Impftermin erhalten
            </Button>
          </form>
        );
      case 1:
        return (
          <>
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                <DialogTitle id='alert-dialog-title'>
                  {'Haben sie den QR-Code gespeichert?'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Wenn sie den Code nicht speichern können sie sich nicht
                    impfen lassen.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Nein</Button>
                  <Button onClick={backHandler} autoFocus>
                    Ja
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <Review respName={respName} respTimestamp={respDate} respId={respId} />
            <Button
              variant='contained'
              onClick={handleClickOpen}
              sx={{mt: 3, ml: 1}}
            >
              weiteren Termin erstellen
            </Button>
          </>
        );
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position='absolute'
        color='default'
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap>
            Impftermin Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component='main' maxWidth='sm' sx={{mb: 4}}>
        <Paper variant='outlined' sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
          {activeStep === 0 && (
            <Typography component='h1' variant='h4' align='center'>
              Geben Sie Ihre Daten an
            </Typography>
          )}
          {activeStep === 1 && (
            <Typography component='h1' variant='h4' align='center'>
              Speichern Sie den QR-Code oder die ID
            </Typography>
          )}

          <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {error && <Alert severity='error'>{error}</Alert>}
          {getStepContent(activeStep)}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
