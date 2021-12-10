import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

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
  uuid: string;
}) {
  //todo UUID gen for new logs
  const [type, setType] = useState<string>(props.types[0]);
  const [breakTime, setBreakTime] = useState<number>(45);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>('');

  const handleTest = () => {
    console.log(props.month);
    console.log(props.types);
    console.log(props.uuid);
    console.log(breakTime);
    console.log(travelTime);
    console.log(logMsg);
    console.log(type);
  };
  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = () => {};
  const handleRemote = () => {};
  //! TODO STACK Für übersicht
  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <CardContent>
        <Button onClick={handleTest}>Test</Button>
        <Box style={{alignItems: 'center'}}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel id='select-label-typState'>
                {props.types.length === 1
                  ? 'Only one typ in this project'
                  : 'Typ'}
              </InputLabel>
              <Select
                labelId='select-label-typ'
                id='demo-simple-select-typ'
                value={type}
                label={
                  props.types.length === 1
                    ? 'Only one typ in this project'
                    : 'Typ'
                }
                onChange={setTypeHandler}
                disabled={props.types.length === 1}
              >
                {props.types.map((typ, idx) => (
                  <MenuItem key={idx} value={typ}>
                    {typ}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component='fieldset'>
              <RadioGroup
                row
                aria-label='position'
                name='position'
                defaultValue='remote'
                onChange={handleRemote}
                sx={{mr: 2}}
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
                  label='on Site'
                  labelPlacement='start'
                />
              </RadioGroup>
            </FormControl>
            <div className='picker'>
              <Typography style={{color: '#838282'}}>Select day</Typography>
              <DatePicker
                id='datePicker'
                wrapperClassName='datePicker'
                dateFormat='dd/MM/yyyy'
                required={true}
                selected={null}
                minDate={new Date('2020-01-01')}
                maxDate={new Date()}
                showYearDropdown
                scrollableMonthYearDropdown
                onChange={() => {}}
              ></DatePicker>
            </div>
            <TextField
              label='Break time (Minutes)'
              value={breakTime}
              onChange={(e) => setBreakTime(parseInt(e.target.value))}
              type='number'
              inputProps={{min: '0', max: '180', step: '15'}}
              sx={{width: 176, mb: 1, mt: 2}}
            />
            <TextField
              label='Travel time (Minutes)'
              value={travelTime}
              onChange={(e) => setTravelTime(parseInt(e.target.value))}
              type='number'
              inputProps={{min: '0', max: '180', step: '15'}}
              sx={{width: 176, mt: 2}}
            />
            <TextField
              label='Comment'
              required={true}
              value={logMsg}
              onChange={(e) => setLogMsg(e.target.value)}
              sx={{width: 400, mb: 1, mt: 2}}
            />
            <Button
              variant='contained'
              startIcon={<NoteAddIcon />}
              type='submit'
              sx={{mt: 3, ml: 1}}
            >
              commit
            </Button>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}
