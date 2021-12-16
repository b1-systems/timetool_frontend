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

export default function InputPerdiem(props: {
  projectPerdiemtModelsAsObject: Object;
  setTypeOfPerdiem(type: number): void;
  setLogMsg(msg: string): void;
  logMsg: string;
}) {
  const [model, setModel] = useState<string>(
    Object.values(props.projectPerdiemtModelsAsObject)[0],
  );
  const perdiemModelHandler = (model: string) => {
    switch (model) {
      case 'VMA Ausland':
        props.setTypeOfPerdiem(4);
        break;
      case '32 € 24h ab 3 Mon':
        props.setTypeOfPerdiem(5);
        break;
      case '16 € Anreise ab 3 Mon':
        props.setTypeOfPerdiem(6);
        break;
      case '14 € VMA Anreise':
        props.setTypeOfPerdiem(7);
        break;
      case '28 € VMA 24h':
        props.setTypeOfPerdiem(8);
        break;
      default:
        props.setTypeOfPerdiem(-1);
    }
  };
  const _test = {
    4: 'VMA Ausland',
    5: '32 € 24h ab 3 Mon',
    6: '16 € Anreise ab 3 Mon',
    7: '14 € VMA Anreise',
    8: '28 € VMA 24h',
  };

  const setModelHandler = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
    perdiemModelHandler(event.target.value as string);
  };

  return (
    <Grid container spacing={1} sx={{mt: 1}}>
      <Grid item xs={5}>
        <TextField
          fullWidth
          label='Comment'
          required={true}
          value={props.logMsg}
          onChange={(e) => props.setLogMsg(e.target.value)}
        />
      </Grid>
      <Grid item xs={5}>
        <FormControl fullWidth>
          <InputLabel id='select-label-modelState'>Model</InputLabel>
          <Select
            labelId='select-label-model'
            id='demo-simple-select-model'
            value={model}
            label='Model'
            onChange={setModelHandler}
          >
            {Object.values(props.projectPerdiemtModelsAsObject).map(
              (singleModel, idx) => (
                <MenuItem key={idx} value={singleModel}>
                  {singleModel}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
