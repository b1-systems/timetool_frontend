import React from 'react';

import { Alert, Card, CardContent, Container } from '@mui/material';
import Box from '@mui/material/Box';

import { Perdiem, Timelog } from '../models';

export default function InputCard(props: {
  timelogs: Timelog[];
  perdiems: Perdiem[];
}) {
  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <CardContent>
        <ul>
          {props.timelogs.map((log) => (
            <li>
              {log.start_dt}
              {new Date(log.start_dt * 1000).toLocaleTimeString('en-US')}
            </li>
          ))}
        </ul>
        <ul>
          {props.perdiems.map((log) => (
            <li>
              {log.date}
              {new Date(log.date * 1000).toLocaleTimeString('en-US')}
            </li>
          ))}
        </ul>
        <Container>
          <Box sx={{mx: 'auto', textAlign: 'center', p: 5}}>
            <Alert severity='info' sx={{textAlign: 'center'}}>
              "No timelogs have been made yet."
            </Alert>
          </Box>
        </Container>
      </CardContent>
    </Card>
  );
}
