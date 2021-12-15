import React, { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { v4 as uuidv4 } from 'uuid';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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

import { fetchDelete } from '../api';
import { Timelog } from '../models';

export default function OutputShift(props: {log: Timelog}) {
  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: {uuid: uuid},
    };
    fetchDelete(requestPrototype);
  };

  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <li>
        Date:&ensp;
        {new Date(props.log.start_dt * 1000).toLocaleDateString('de-DE')}
        &ensp; Project name:&ensp;
        {props.log.project_name}&ensp;
        <Button onClick={() => deleteHandler(props.log.uuid)}>
          <DeleteForeverIcon />
        </Button>
      </li>
      {!!props.log.incidents &&
        props.log.incidents?.map((incident) => (
          <>
            <div>
              from:&ensp;
              {new Date(incident.start_dt * 1000).toLocaleDateString('de-DE')}
              &ensp;at:&ensp;
              {new Date(incident.start_dt * 1000).toLocaleTimeString('de-DE')}
              &ensp;to:&ensp;
              {new Date(incident.end_dt * 1000).toLocaleDateString('de-DE')}
              &ensp;at:&ensp;
              {new Date(incident.end_dt * 1000).toLocaleTimeString('de-DE')}
            </div>
            <div>comment:&ensp;{incident.comment}</div>
          </>
        ))}
    </Card>
  );
}
