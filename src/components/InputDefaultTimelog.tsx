import { DateTime } from 'luxon';
import React from 'react';

import { TimePicker } from '@mui/lab';
import {
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	TextField,
} from '@mui/material';

export default function InputDefaultTimelog(props: {
  day: DateTime;
  to: DateTime;
  from: DateTime;
  setToCard(time: DateTime): void;
  setFromCard(time: DateTime): void;
  handleRemote(): void;
  setBreakTime(time: number): void;
  breakTime: number;
  setTravelTime(time: number): void;
  travelTime: number;
  setLogMsg(msg: string): void;
  logMsg: string;
}) {
  return (
    <Grid container spacing={1} sx={{mt: 1}}>
      <Grid item xs={3}>
        <TextField
          sx={{width: '50%'}}
          label='Break time (Minutes)'
          value={props.breakTime}
          onChange={(e) => props.setBreakTime(parseInt(e.target.value))}
          type='number'
          inputProps={{min: '0', max: '1000'}}
        />
        <TextField
          sx={{width: '50%'}}
          label='Travel time (Minutes)'
          value={props.travelTime}
          onChange={(e) => props.setTravelTime(parseInt(e.target.value))}
          type='number'
          inputProps={{min: '0'}}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          label='Comment'
          required={true}
          value={props.logMsg}
          onChange={(e) => props.setLogMsg(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <FormControl component='fieldset'>
          <RadioGroup
            row
            aria-label='position'
            name='position'
            defaultValue='remote'
            onChange={props.handleRemote}
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
      <Grid item xs={3}>
        <TimePicker
          label='From'
          value={props.from}
          ampm={false}
          ampmInClock={false}
          onChange={(newValue) => {
            if (newValue) {
              props.setFromCard(newValue.set({second: 0, millisecond: 0}));
            }
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
      <Grid item xs={3}>
        <TimePicker
          label='To'
          ampm={false}
          ampmInClock={false}
          value={props.to}
          onChange={(newValue) => {
            if (newValue) {
              props.setToCard(newValue.set({second: 0, millisecond: 0}));
            }
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
    </Grid>
  );
}
