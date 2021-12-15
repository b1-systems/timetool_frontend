import { DateTime } from 'luxon';
import React, { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DatePicker from '@mui/lab/DatePicker';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fetchSubmit } from '../api';
import { Incident } from '../models';
import InputDefaultTimelog from './InputDefaultTimelog';
import InputPerdiem from './InputPerdiem';
import Inputshift from './InputShift';

export default function InputCard(props: {
  types: string[];
  month: DateTime;
  uuidProject: string | null;
  uuidLog: string | null;
  projectShiftModels: string[];
}) {
  const [type, setType] = useState<string>(props.types[0]);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<DateTime>(props.month);
  const [remote, setRemote] = useState<boolean>(true);
  const [shift, setShift] = useState<string>('');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [from, setFrom] = useState<DateTime>(props.month);
  const [to, setTo] = useState<DateTime>(props.month);
  const [typeOfPerdiem, setTypeOfPerdiem] = useState<number>(-1);

  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let onsiteRemote = 'remote';
    if (remote === false) {
      onsiteRemote = 'onsite';
    }
    if (type === 'timelog' && props.uuidProject && from && to) {
      fetchSubmit({
        uuid: props.uuidLog || uuidv4(),
        project_uuid: props.uuidProject,
        start_dt: Math.round(from.valueOf() / 1000),
        end_dt: Math.round(to.valueOf() / 1000),
        type: type,
        breakTime: breakTime * 60,
        travelTime: travelTime * 60,
        comment: logMsg,
        onsite: onsiteRemote,
      });
    }
    if (type === 'perdiem' && props.uuidProject && selectedDay) {
      fetchSubmit({
        uuid: props.uuidLog || uuidv4(),
        project_uuid: props.uuidProject,
        start_dt: Math.round(selectedDay.valueOf() / 1000),
        type: typeOfPerdiem,
        comment: logMsg,
        is_perdiem: true,
      });
    }
  };

  //typy sie nenne einzel, fetch direct mit werten
  //luxon luxon adap, mui datepicker
  //in eigene comp die cards für ausgabe

  const handleRemote = () => {
    setRemote(!remote);
  };

  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Box sx={{mx: 'auto', textAlign: 'start', p: 3}}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <DatePicker
                  views={['day']}
                  label='Day'
                  minDate={props.month}
                  maxDate={props.month.plus({months: 1})}
                  value={selectedDay}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDay(newValue);
                      setFrom(newValue);
                      setTo(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id='select-label-typeState'>Type</InputLabel>
                  <Select
                    labelId='select-label-type'
                    id='demo-simple-select-type'
                    value={type}
                    label='Type'
                    disabled={!props.types.length}
                    onChange={setTypeHandler}
                  >
                    {props.types.map((singleType, idx) => (
                      <MenuItem key={idx} value={singleType}>
                        {singleType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {type === 'shift' && (
              <Inputshift
                shiftModels={props.projectShiftModels}
                setShift={setShift}
                setIncidents={setIncidents}
                day={selectedDay}
              />
            )}

            {type === 'timelog' && (
              <InputDefaultTimelog
                day={selectedDay}
                to={to}
                from={from}
                setToCard={setTo}
                setFromCard={setFrom}
                handleRemote={handleRemote}
                setBreakTime={setBreakTime}
                breakTime={breakTime}
                setTravelTime={setTravelTime}
                travelTime={travelTime}
                setLogMsg={setLogMsg}
                logMsg={logMsg}
              />
            )}

            {type === 'perdiem' && (
              <InputPerdiem setTypeOfPerdiem={setTypeOfPerdiem} />
            )}
          </Box>
        </CardContent>
        <CardActions>
          <Button
            sx={{mt: 1, width: 250}}
            size='large'
            variant='contained'
            startIcon={<NoteAddIcon />}
            type='submit'
          >
            commit
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
