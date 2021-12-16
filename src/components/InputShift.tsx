import { DateTime } from 'luxon';
import React, { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { TimePicker } from '@mui/lab';
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

import { Incident } from '../models';

export default function InputShift(props: {
  shiftModels: string[];
  shift: string;
  setShift(shiftModel: string): void;
  incidents: Incident[];
  setIncidents(Incidents: Incident[]): void;
  day: DateTime;
}) {
  const setShiftModelHandler = (event: SelectChangeEvent) => {
    props.setShift(event.target.value as string);
  };

  const addHandler = () => {
    props.setIncidents([
      ...props.incidents,
      {start_dt: 0, end_dt: 0, comment: ''},
    ]);
  };

  return (
    <>
      <Grid item xs={4} sx={{mt: 1}}>
        <FormControl fullWidth>
          <InputLabel id='select-label-shiftModelState'>Shift model</InputLabel>
          <Select
            labelId='select-label-shiftModel'
            id='demo-simple-select-shiftModel'
            value={props.shift}
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
        <Button
          sx={{mt: 1}}
          onClick={addHandler}
          variant='contained'
          startIcon={<NoteAddIcon />}
        >
          Add Entry
        </Button>
        {props.incidents.map((incident, index) => (
          <Grid container spacing={1} sx={{mt: 1}}>
            <Grid item xs={2}>
              <TimePicker
                label='From'
                value={DateTime.fromSeconds(incident.start_dt).toUTC()}
                ampm={false}
                ampmInClock={false}
                onChange={(newValue) => {
                  if (newValue) {
                    props.setIncidents([
                      ...props.incidents.slice(0, index),
                      {
                        ...incident,
                        start_dt:
                          newValue
                            .set({second: 0, millisecond: 0})
                            .toUTC()
                            .valueOf() / 1000,
                      },
                      ...props.incidents.slice(index + 1),
                    ]);
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={2}>
              <TimePicker
                label='To'
                ampm={false}
                ampmInClock={false}
                value={DateTime.fromSeconds(incident.end_dt).toUTC()}
                onChange={(newValue) => {
                  if (newValue) {
                    props.setIncidents([
                      ...props.incidents.slice(0, index),
                      {
                        ...incident,
                        end_dt:
                          newValue
                            .set({second: 0, millisecond: 0})
                            .toUTC()
                            .valueOf() / 1000,
                      },
                      ...props.incidents.slice(index + 1),
                    ]);
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label='Comment'
                required={true}
                value={incident.comment}
                onChange={(e) => {
                  props.setIncidents([
                    ...props.incidents.slice(0, index),
                    {
                      ...incident,
                      comment: e.target.value,
                    },
                    ...props.incidents.slice(index + 1),
                  ]);
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                color='error'
                variant='contained'
                onClick={() => {
                  props.setIncidents([
                    ...props.incidents.slice(0, index),
                    ...props.incidents.slice(index + 1),
                  ]);
                }}
              >
                <DeleteIcon />
              </Button>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
