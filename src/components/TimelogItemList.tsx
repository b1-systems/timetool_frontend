import { timeLog } from 'console';
import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
	Alert,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Grid,
} from '@mui/material';
import Box from '@mui/material/Box';

import { fetchDelete } from '../api';
import { Perdiem, Timelog } from '../models';
import OutputPerdiem from './OutputPerdiem';
import OutputShift from './OutputShift';
import OutputTimelogs from './OutputTimelog';

export default function InputCard(props: {
  setEndMonthOpen(open: boolean): void;
  monthIsClosed: boolean;
  timelogs: Timelog[];
  perdiems: Perdiem[];
  deleteTimelog(uuid: string): void;
  deletePerdiem(uuid: string): void;
}) {
  let defaultTimelogs = props.timelogs
    .filter((log) => log.type === 'default')
    .sort(function (x, y) {
      return x.start_dt - y.start_dt;
    });

  let shiftTimelogs = props.timelogs
    .filter((log) => log.type === 'shift')
    .sort(function (x, y) {
      return x.start_dt - y.start_dt;
    });

  let perdiems = props.perdiems.sort(function (x, y) {
    return x.start_dt - y.start_dt;
  });
  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300', ml: 1, mr: 1}}>
      <CardContent>
        {!!defaultTimelogs.length && (
          <ul>
            <h3>Timelogs</h3>
            {defaultTimelogs.map((log) => (
              <OutputTimelogs
                monthIsClosed={props.monthIsClosed}
                log={log}
                key={log.uuid}
                deleteTimelog={props.deleteTimelog}
              />
            ))}
          </ul>
        )}
        {!!shiftTimelogs.length && (
          <ul>
            <h3>Shifts</h3>
            {shiftTimelogs.map((log) => (
              <OutputShift
                monthIsClosed={props.monthIsClosed}
                log={log}
                key={log.uuid}
                deleteTimelog={props.deleteTimelog}
              />
            ))}
          </ul>
        )}
        {!!perdiems.length && (
          <ul>
            <h3>Perdiems</h3>
            {perdiems.map((log) => (
              <OutputPerdiem
                monthIsClosed={props.monthIsClosed}
                log={log}
                key={log.uuid}
                deletePerdiem={props.deletePerdiem}
              />
            ))}
          </ul>
        )}
        {defaultTimelogs.length + shiftTimelogs.length + perdiems.length ===
          0 && (
          <Container>
            <Box sx={{mx: 'auto', textAlign: 'center', p: 5}}>
              <Alert severity='info' sx={{textAlign: 'center'}}>
                "No timelogs have been made yet."
              </Alert>
            </Box>
          </Container>
        )}
      </CardContent>
      <CardActions>
        <Grid container>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            {' '}
            <Button
              fullWidth
              sx={{mt: 3, mb: 2, ml: 1, mr: 1}}
              size='large'
              variant='contained'
              startIcon={<NoteAddIcon />}
              disabled={props.monthIsClosed}
              onClick={() => props.setEndMonthOpen(true)}
            >
              end month
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
