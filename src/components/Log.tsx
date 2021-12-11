import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
	Alert,
	Button,
	Card,
	CardContent,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import InputCard from './InputCard';
import { StyledTableCell } from './StyledTable';

export default function Log() {
  const [selectedMoth, setSelectedMonth] = useState<Date | null>(null);
  const [project, setProject] = useState<string>('');
  const [projectUuid, setProjectUuid] = useState<string | null>(null);
  const [uuidLog, setUuidLog] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  //_PLACEHOLDER shicht/paushale=perdiem/default-imelog
  const projects = [
    {
      name: 'Weltherrschaft',
      uuid: '458e6f3d-125c-49f5-934d-21ed20ed350b',
      types: ['default-timelog', 'per diem', 'shift'],
    },
    {
      name: 'kontrolliert Atmen',
      uuid: '042307fc-9320-41d5-998b-23b58ef9e491',
      types: ['default-timelog'],
    },
  ];
  const oldLogs = [
    {
      uuid: '042307fc-9320-41d5-998b-23b58ef9e476',
      date: {
        day: 1567235678,
        entries: [{start: 1567235698, end: 1567235699, msg: 'denken'}],
      },
      typ: 'shift',
      msg: 'Was machen wir heute Brain?',
      project: 'Weltherrschaft',
    },
    {
      uuid: '157307fc-9320-41d5-998b-23b58ef9e476',
      date: {
        day: 1567235678,
      },
      typ: 'default-timelog',
      msg: 'Das Gleiche wie immer Pinky.',
      project: 'Weltherrschaft',
    },
  ];

  const handleChangeProjectState = (event: SelectChangeEvent) => {
    const projectFiltred = projects.filter(
      (project) => project.name === (event.target.value as string),
    );
    setProject(event.target.value as string);
    setProjectUuid(projectFiltred[0].uuid);
    setProjectTypes(projectFiltred[0].types);
    const request = {
      date: selectedMoth,
      project: projectFiltred[0].uuid,
    };
    console.log(
      'prototyp API call',
      'GET',
      '/rest/:date/:project',
      'Body json:',
      request,
    );
  };

  const handleDelte = (uuid: string) => {
    const request = {
      uuid: uuid,
    };
    console.log('prototyp API call', 'DELETE', '/rest/timelog/:loguuid');
    console.log('uuid:', uuid);
  };

  // const handleTest = () => {
  //   console.log(selectedMoth);
  //   console.log(project);
  //   console.log(projectUuid);
  //   console.log(projectTypes);
  // };

  return (
    <Paper>
      <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
        {/* <Button onClick={handleTest}>Test</Button> */}
        <CardContent>
          <Box sx={{mx: 'auto', textAlign: 'start', p: 3}}>
            <Grid container spacing={3}>
              <div className='picker'>
                <Typography style={{color: '#838282'}}>Selcet month</Typography>
                <DatePicker
                  id='datePicker'
                  wrapperClassName='datePicker'
                  dateFormat='LLLL    yyyy'
                  selected={selectedMoth}
                  showMonthYearPicker
                  showFullMonthYearPicker
                  showTwoColumnMonthYearPicker
                  onChange={(newDate: Date | null) => setSelectedMonth(newDate)}
                ></DatePicker>
              </div>
              {/* //todo GET Project for user and month  */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='select-label-projectState'>
                    Project
                  </InputLabel>
                  <Select
                    labelId='select-label-project'
                    id='demo-simple-select-project'
                    value={project}
                    label='Project'
                    onChange={handleChangeProjectState}
                    disabled={!selectedMoth}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.uuid} value={project.name}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      {projectUuid && (
        <>
          <InputCard
            types={projectTypes}
            month={selectedMoth}
            uuidProject={projectUuid}
            uuidLog={uuidLog}
          />
          <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
            <CardContent>
              {oldLogs.length ? (
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Project</StyledTableCell>
                        <StyledTableCell align='center'>
                          Message
                        </StyledTableCell>
                        <StyledTableCell align='center'>Date</StyledTableCell>
                        <StyledTableCell align='center'>Typ</StyledTableCell>
                        <StyledTableCell align='center'>
                          Actions
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {oldLogs.map((log) => (
                        <TableRow key={log.uuid}>
                          <TableCell>{log.project}</TableCell>
                          <TableCell align='center'>{log.msg}</TableCell>
                          <TableCell align='center'>{log.date.day}</TableCell>
                          <TableCell align='center'>{log.typ}</TableCell>
                          <TableCell align='center'>
                            <ToggleButtonGroup>
                              <ToggleButton value='Edit'>
                                <EditIcon color='warning' />
                              </ToggleButton>
                              <ToggleButton value='phone' aria-label='phone'>
                                <FileCopyIcon color='info' />
                              </ToggleButton>
                              <ToggleButton
                                onClick={() => handleDelte(log.uuid)}
                                value='tv'
                                aria-label='tv'
                              >
                                <DeleteIcon color='error' />
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
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
        </>
      )}
    </Paper>
  );
}
