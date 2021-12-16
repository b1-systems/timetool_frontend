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
import { Perdiem } from '../models';

export default function OutputPerdiem(props: {
  monthIsClosed: boolean;
  log: Perdiem;
  deletePerdiem(uuid: string): void;
}) {
  const deleteHandler = (uuid: string) => {
    const requestPrototype = {
      request: {uuid: uuid},
    };
    fetchDelete(requestPrototype);
    props.deletePerdiem(uuid);
  };
  const logTypeHandler = (type: number) => {
    switch (type) {
      case 4:
        return 'VMA Ausland';
      case 5:
        return '32 € 24h ab 3 Mon';
      case 6:
        return '16 € Anreise ab 3 Mon';
      case 7:
        return '14 € VMA Anreise';
      case 8:
        return '28 € VMA 24h';
      default:
        return 'unkown type';
    }
  };
  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
      <li>
        Date:&ensp;
        {new Date(props.log.start_dt * 1000).toLocaleDateString('de-DE')}
        &ensp; Project name:&ensp;
        {props.log.project_name}&ensp; Typ:&ensp;
        {logTypeHandler(props.log.type)}&ensp; comment:&ensp;
        {props.log.comment}
        <Button
          onClick={() => deleteHandler(props.log.uuid)}
          disabled={props.monthIsClosed}
        >
          <DeleteForeverIcon />
        </Button>
      </li>
    </Card>
  );
}
