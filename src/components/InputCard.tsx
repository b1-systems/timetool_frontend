import React, { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { v4 as uuidv4 } from 'uuid';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
	Button,
	Card,
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

export default function InputCard(props: {
  types: string[];
  month: Date | null;
  uuidProject: string | null;
  uuidLog: string | null;
}) {
  const [type, setType] = useState<string>(props.types[0]);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<Date | null>(props.month);

  // const handleTest = () => {
  //   console.log(props.month);
  //   console.log(props.types);
  //   console.log(props.uuid);
  //   console.log(breakTime);
  //   console.log(travelTime);
  //   console.log(logMsg);
  //   console.log(type);
  // };
  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let request;
    if (props.uuidLog === null) {
      request = {
        uuidProject: props.uuidProject,
        uuidLog: uuidv4(),
        type: type,
        breakTime: breakTime,
        travelTime: travelTime,
        logMsg: logMsg,
        selectedDay: selectedDay,
      };
    } else {
      request = {
        uuidProject: props.uuidProject,
        uuidLog: props.uuidLog,
        type: type,
        breakTime: breakTime,
        travelTime: travelTime,
        logMsg: logMsg,
        selectedDay: selectedDay,
      };
    }
    console.log(
      'prototyp API call',
      'PUT',
      '/rest/timelog/:loguuid',
      'Body json:',
      request,
    );
  };

  const handleRemote = () => {};
  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <CardContent>
        {/* <Button onClick={handleTest}>Test</Button> */}
        <Box sx={{mx: 'auto', textAlign: 'start', p: 3}}>
          <form onSubmit={handleSubmit}>
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
                  <InputLabel id='select-label-typState'>Typ</InputLabel>
                  <Select
                    labelId='select-label-typ'
                    id='demo-simple-select-typ'
                    value={type}
                    label='Typ'
                    onChange={setTypeHandler}
                  >
                    {props.types.map((typ, idx) => (
                      <MenuItem key={idx} value={typ}>
                        {typ}
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
                      value='on Site'
                      control={<Radio />}
                      label='on site'
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
              <Grid item xs={3}>
                <Button
                  sx={{mt: 1, width: 250}}
                  size='large'
                  variant='contained'
                  startIcon={<NoteAddIcon />}
                  type='submit'
                >
                  commit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}
