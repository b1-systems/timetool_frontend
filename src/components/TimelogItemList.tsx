import { timeLog } from 'console';
import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Alert, Button, Card, CardContent, Container } from '@mui/material';
import Box from '@mui/material/Box';

import { fetchDelete } from '../api';
import { Perdiem, Timelog } from '../models';

export default function InputCard(props: {
  timelogs: Timelog[];
  perdiems: Perdiem[];
}) {
  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: {uuid: uuid},
    };
    fetchDelete(requestPrototype);
  };

  const logTypeHandler = (type: number) => {
    if (type === 4) {
      return 'VMA Ausland';
    }
    if (type === 5) {
      return '32 € 24h ab 3 Mon';
    }
    if (type === 6) {
      return '16 € Anreise ab 3 Mon';
    }
    if (type === 7) {
      return '14 € VMA Anreise';
    }
    if (type === 8) {
      return '28 € VMA 24h';
    }
  };

  const defaultTimelogs = props.timelogs
    .filter((log) => log.type === 'default')
    .sort(function (x, y) {
      return x.start_dt - y.start_dt;
    });

  const shiftTimelogs = props.timelogs
    .filter((log) => log.type === 'shift')
    .sort(function (x, y) {
      return x.start_dt - y.start_dt;
    });

  const perdiems = props.perdiems.sort(function (x, y) {
    return x.start_dt - y.start_dt;
  });

  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <CardContent>
        {!!defaultTimelogs.length && (
          <ul>
            <h3>Timelogs</h3>
            {defaultTimelogs.map((log) => (
              <>
                <li>
                  Date:&ensp;
                  {new Date(log.start_dt * 1000).toLocaleDateString('de-DE')}
                  &ensp; Project name:&ensp;
                  {log.project_name}&ensp; comment:&ensp;{log.comment}&ensp;
                  onsite:&ensp;{log.onsite}
                  <Button onClick={() => deleteHandler(log.uuid)}>
                    <DeleteForeverIcon />
                  </Button>
                </li>
              </>
            ))}
          </ul>
        )}
        {!!shiftTimelogs.length && (
          <ul>
            <h3>Shifts</h3>
            {shiftTimelogs.map((log) => (
              <>
                <li>
                  Date:&ensp;
                  {new Date(log.start_dt * 1000).toLocaleDateString('de-DE')}
                  &ensp; Project name:&ensp;
                  {log.project_name}&ensp;
                  <Button onClick={() => deleteHandler(log.uuid)}>
                    <DeleteForeverIcon />
                  </Button>
                </li>
                {!!log.incidents &&
                  log.incidents?.map((incident) => (
                    <>
                      <div>
                        from:&ensp;
                        {new Date(incident.start_dt * 1000).toLocaleDateString(
                          'de-DE',
                        )}
                        &ensp;at:&ensp;
                        {new Date(incident.start_dt * 1000).toLocaleTimeString(
                          'de-DE',
                        )}
                        &ensp;to:&ensp;
                        {new Date(incident.end_dt).toLocaleDateString('de-DE')}
                        &ensp;at:&ensp;
                        {new Date(incident.end_dt * 1000).toLocaleTimeString(
                          'de-DE',
                        )}
                      </div>
                      <div>comment:&ensp;{incident.comment}</div>
                    </>
                  ))}
              </>
            ))}
          </ul>
        )}
        {!!perdiems.length && (
          <ul>
            <h3>Perdiems</h3>
            {perdiems.map((log) => (
              <>
                <li>
                  Date:&ensp;
                  {new Date(log.start_dt * 1000).toLocaleDateString('de-DE')}
                  &ensp; Project name:&ensp;
                  {log.project_name}&ensp; Typ:&ensp;
                  {logTypeHandler(log.type)}&ensp; comment:&ensp;
                  {log.comment}
                  <Button onClick={() => deleteHandler(log.uuid)}>
                    <DeleteForeverIcon />
                  </Button>
                </li>
              </>
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
    </Card>
  );
}
