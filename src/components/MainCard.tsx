import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import React, { useState } from 'react';
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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { Log, Project } from '../../models';
import { fetchOldLogs, fetchProjects } from '../api';
import InputCard from './InputCard';
import MonthEndDialog from './MonthEndDialog';
import { StyledTableCell } from './StyledTable';

export default function MainCard() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [oldLogs, setoldLogs] = useState<Log[]>([]);
  const [project, setProject] = useState<string>('');
  const [projectUuid, setProjectUuid] = useState<string | null>(null);
  const [uuidLog, setUuidLog] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [endMonthOpen, setEndMonthOpen] = useState(false);

  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  const handleDelte = (uuid: string) => {
    const request = {
      uuid: uuid,
    };
    console.log('prototyp API call', 'DELETE', '/rest/timelog/:loguuid');
    console.log('uuid:', request.uuid);
  };

  const setMonthGetProjectsHandler = (newDate: Date | null) => {
    setSelectedMonth(newDate);
    let requestPrototyp;
    if (newDate !== null) {
      requestPrototyp = {
        params: {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          scope: 'me',
        },
      };
      fetchProjects(requestPrototyp)
        .then((response) => {
          return response.json();
        })
        .then((projects) => {
          setAvailableProjects(projects);
        });
    }
  };

  const setProjectGetLogsHandler = (event: SelectChangeEvent) => {
    const projectFiltred = availableProjects.filter(
      (project) => project.name === (event.target.value as string),
    );
    setProject(event.target.value as string);
    setProjectUuid(projectFiltred[0].uuid);
    setProjectTypes(projectFiltred[0].worktypes);
    let requestPrototyp;
    if (selectedMonth !== null) {
      requestPrototyp = {
        params: {
          year: selectedMonth.getFullYear(),
          month: selectedMonth.getMonth(),
        },
      };
      fetchOldLogs(requestPrototyp);
    }
  };

  return (
    <Paper>
      <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
        {endMonthOpen && (
          <MonthEndDialog
            close={monthEndHandler}
            selectedMonth={selectedMonth}
          />
        )}
        <CardContent>
          <Box sx={{mx: 'auto', textAlign: 'start', p: 3}}>
            <Grid container spacing={3}>
              <div className='picker'>
                <Typography style={{color: '#838282'}}>Selcet month</Typography>
                <DatePicker
                  id='datePicker'
                  wrapperClassName='datePicker'
                  dateFormat='LLLL    yyyy'
                  selected={selectedMonth}
                  showMonthYearPicker
                  showFullMonthYearPicker
                  showTwoColumnMonthYearPicker
                  onChange={(newDate: Date | null) =>
                    setMonthGetProjectsHandler(newDate)
                  }
                ></DatePicker>
              </div>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id='select-label-projectState'>
                    Project
                  </InputLabel>
                  <Select
                    labelId='select-label-project'
                    id='demo-simple-select-project'
                    value={project}
                    label='Project'
                    onChange={setProjectGetLogsHandler}
                    disabled={!selectedMonth}
                  >
                    {availableProjects.map((project) => (
                      <MenuItem key={project.uuid} value={project.name}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Button
                  sx={{mt: 1, width: 250}}
                  size='large'
                  variant='contained'
                  startIcon={<NoteAddIcon />}
                  disabled={!selectedMonth}
                  onClick={() => setEndMonthOpen(true)}
                >
                  end month
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      {projectUuid && (
        <>
          <InputCard
            types={projectTypes}
            month={selectedMonth}
            uuidProject={projectUuid}
            uuidLog={uuidLog}
          />
          <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
            <CardContent>
              {/* {oldLogs.length ? (
                      {oldLogs.map(
                        (log) => {
                          log.perdiems.length &&
                            log.perdiems.forEach((perdiem) => {
                              renderPerdiem(perdiem);
                            });
                          log.timelogs.length &&
                            log.perdiems.forEach((timelog) =>
                              renderTimelog(timelog),
                            );
                        },
                        // (

                        //   <TableRow key={log.uuid}>
                        //     <TableCell>{log.project}</TableCell>
                        //     <TableCell align='center'>{log.msg}</TableCell>
                        //     <TableCell align='center'>{log.date.day}</TableCell>
                        //     <TableCell align='center'>{log.typ}</TableCell>
                        //     <TableCell align='center'>
                        //       <ToggleButtonGroup>
                        //         <ToggleButton value='Edit'>
                        //           <EditIcon color='warning' />
                        //         </ToggleButton>
                        //         <ToggleButton value='Copy'>
                        //           <FileCopyIcon color='info' />
                        //         </ToggleButton>
                        //         <ToggleButton
                        //           onClick={() => handleDelte(log.uuid)}
                        //           value='Delete'
                        //         >
                        //           <DeleteIcon color='error' />
                        //         </ToggleButton>
                        //       </ToggleButtonGroup>
                        //     </TableCell>
                        //   </TableRow>
                        // )
                      )}
                    {/* </TableBody>
                  </Table>
                </TableContainer> */}
              ) : (
              <Container>
                <Box sx={{mx: 'auto', textAlign: 'center', p: 5}}>
                  <Alert severity='info' sx={{textAlign: 'center'}}>
                    "No timelogs have been made yet."
                  </Alert>
                </Box>
              </Container>
            </CardContent>
          </Card>
        </>
      )}
    </Paper>
  );
}
