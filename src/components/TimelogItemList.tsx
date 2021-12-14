import React, { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { v4 as uuidv4 } from 'uuid';

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

export default function InputCard(
    props: {
        timelogs,
        perdiems
    }) {
  const [type, setType] = useState<string>(props.types[0]);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [logMsg, setLogMsg] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<Date | null>(props.month);

  const setTypeHandler = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let request;
    if (props.uuidLog === null) {
      request = {
        uuidProject: props.uuidProject,
        uuidLog: uuidv4(),
        type: type,
        breakTime: breakTime,
        travelTime: travelTime,
        logMsg: logMsg,
        selectedDay: selectedDay,
      };
    } else {
      request = {
        uuidProject: props.uuidProject,
        uuidLog: props.uuidLog,
        type: type,
        breakTime: breakTime,
        travelTime: travelTime,
        logMsg: logMsg,
        selectedDay: selectedDay,
      };
    }
    console.log(
      'prototyp API call',
      'PUT',
      '/rest/timelog/:loguuid',
      'Body json:',
      request,
    );
  };

  const handleRemote = () => {};
  return (
    <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
    <CardContent><ul>
    {oldLogs.timelogs.map((log) => {
        <li>{log.start_dt}
        {new Date(log.start_dt * 1000).toLocaleTimeString('en-US')}
        </li>;
    })
    }
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
