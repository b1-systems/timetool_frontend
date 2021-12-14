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

import { Incidents } from '../models';

export default function InputShift(props: {
  shiftModels: string[];
  setShift: Function;
  setIncidents: Function;
  day: Date | null;
}) {
  const [shift, setShift] = useState<string>(props.shiftModels[0]);
  const [length, setLength] = useState<number>(0);
  // incidents: [
  //     {
  //     start_dt: 123,
  //     end_dt: 123,
  //     comment: "mitteilung"
  //     }]
  //   shift_model:"morning" //solte auch in log-liste angezeigt werden
  const [from, setFrom] = useState<Date | null>(props.day);
  const [to, setTo] = useState<Date | null>(props.day);
  const setShiftModelHandler = (event: SelectChangeEvent) => {
    setShift(event.target.value as string);
    props.setShift(event.target.value as string);
  };

  const addHandler = () => {
    setLength(length + 1);
  };

  return (
    <>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id='select-label-shiftModelState'>Shift model</InputLabel>
          <Select
            labelId='select-label-shiftModel'
            id='demo-simple-select-shiftModel'
            value={shift}
            label='shiftModel'
            onChange={setShiftModelHandler}
          >
            {props.shiftModels.map((singleType, idx) => (
              <MenuItem key={idx} value={singleType}>
                {singleType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={addHandler}>Add Entry</Button>
        {Array(length).fill(
          <Grid item xs={4}>
            <div className='picker'>
              <Typography style={{color: '#838282'}}>From:</Typography>
              <DatePicker
                id='datePicker'
                wrapperClassName='datePicker'
                dateFormat='dd/MM/yy'
                required={true}
                minDate={props.day}
                selected={from}
                onChange={(newDate: Date | null) => setFrom(newDate)}
              ></DatePicker>

              <Typography style={{color: '#838282'}}>To:</Typography>
              <DatePicker
                id='datePicker'
                wrapperClassName='datePicker'
                dateFormat='dd/MM/yy'
                required={true}
                minDate={props.day}
                selected={to}
                onChange={(newDate: Date | null) => setTo(newDate)}
              ></DatePicker>
            </div>
          </Grid>,
        )}
      </Grid>
    </>
  );
}
