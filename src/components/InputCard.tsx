import React, { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { v4 as uuidv4 } from 'uuid';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
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
import { Incidents } from '../models';
import InputDefaultTimelog from './InputDefaultTimelog';
import InputPerdiem from './InputPerdiem';
import Inputshift from './InputShift';

export default function InputCard(props: {
  types: string[];
  month: Date | null;
  uuidProject: string | null;
  uuidLog: string | null;
  projectShiftModels: string[];
}) {
  const [type, setType] = useState<string>(props.types[0]);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<Date | null>(props.month);
  const [remote, setRemote] = useState<boolean>(true);
  const [shift, setShift] = useState<string>('');
  const [incidents, setIncidents] = useState<Incidents[]>([]);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // let onsiteRemote = 'remote';
    // if (remote === false) {
    //   onsiteRemote = 'onsite';
    // }
    // if (type === 'timelog') {
    //   let requestPrototype;
    //   if (props.uuidLog === null) {
    //     requestPrototype = {
    //       request: {
    //         uuid: uuidv4(),
    //         project_uuid: props.uuidProject,
    //         start_dt: from,
    //         end_dt: to,
    //         type: type,
    //         breakTime: breakTime * 60,
    //         travelTime: travelTime * 60,
    //         comment: logMsg,
    //         onsite: onsiteRemote,
    //       }
    //     };
    //   } else {
    //     requestPrototype = {
    //       request: {
    //         uuid: props.uuidLog,
    //         project_uuid: props.uuidProject,
    //         start_dt: from,
    //         end_dt: to,
    //         type: type,
    //         breakTime: breakTime * 60,
    //         travelTime: travelTime * 60,
    //         comment: logMsg,
    //         onsite: onsiteRemote,
    //       }
    //     };
    //   }
    //   fetchSubmit(requestPrototype)}
    // }
  };

  const handleRemote = () => {
    setRemote(!remote);
  };

  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Box sx={{mx: 'auto', textAlign: 'start', p: 3}}>
            <Grid container spacing={3}>
              <div className='picker'>
                <Typography style={{color: '#838282'}}>Select day</Typography>
                <DatePicker
                  id='datePicker'
                  wrapperClassName='datePicker'
                  dateFormat='dd/MM/yy'
                  required={true}
                  minDate={props.month}
                  selected={selectedDay}
                  showYearDropdown={!!props.uuidLog}
                  scrollableMonthYearDropdown={!!props.uuidLog}
                  onChange={(newDate: Date | null) => setSelectedDay(newDate)}
                ></DatePicker>
              </div>
              <Grid item xs={4}>
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
              <Grid item xs={3}>
                <FormControl component='fieldset'>
                  <RadioGroup
                    row
                    aria-label='position'
                    name='position'
                    defaultValue='remote'
                    onChange={handleRemote}
                  >
                    <FormControlLabel
                      value='remote'
                      control={<Radio />}
                      label='remote'
                      labelPlacement='start'
                    />
                    <FormControlLabel
                      value='onsite'
                      control={<Radio />}
                      label='onsite'
                      labelPlacement='start'
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{textAlign: 'start', mt: 0}}>
              <TextField
                sx={{mt: 3, width: 150}}
                label='Break time (Minutes)'
                value={breakTime}
                onChange={(e) => setBreakTime(parseInt(e.target.value))}
                type='number'
                inputProps={{min: '0', max: '180', step: '15'}}
              />
              <TextField
                sx={{mt: 3, width: 150}}
                label='Travel time (Minutes)'
                value={travelTime}
                onChange={(e) => setTravelTime(parseInt(e.target.value))}
                type='number'
                inputProps={{min: '0', step: '15'}}
              />
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label='Comment'
                  required={true}
                  value={logMsg}
                  onChange={(e) => setLogMsg(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Box>
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
            />
          )}
          {type === 'perdiem' && <InputPerdiem />}
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
