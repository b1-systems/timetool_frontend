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

export default function InputDefaultTimelog(props: {
  day: Date | null;
  to: Date | null;
  from: Date | null;
  setToCard: Function;
  setFromCard: Function;
}) {
  return (
    <Grid item xs={4}>
      <div className='picker'>
        <Typography style={{color: '#838282'}}>From:</Typography>
        <DatePicker
          id='datePicker'
          wrapperClassName='datePicker'
          required={true}
          minDate={props.day}
          selected={props.from}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='h:mm'
          onChange={(newDate: Date | null) => props.setFromCard(newDate)}
        ></DatePicker>
        <Typography style={{color: '#838282'}}>To:</Typography>
        <DatePicker
          id='datePicker'
          wrapperClassName='datePicker'
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='h:mm'
          required={true}
          minDate={props.day}
          selected={props.to}
          onChange={(newDate: Date | null) => props.setToCard(newDate)}
        ></DatePicker>
      </div>
    </Grid>
  );
}
