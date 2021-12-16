import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DatePicker from '@mui/lab/DatePicker';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { fetchCurrentMonthLogs, fetchProjects } from '../api';
import { Logs, Perdiem, Project, Timelog } from '../models';
//start import only for testing without backend
import {
	_dummy_old_logs_1,
	_dummy_old_logs_2,
	_dummy_projects,
} from './dummyData';
//end
import InputCard from './InputCard';
import MonthEndDialog from './MonthEndDialog';
import TimelogItemList from './TimelogItemList';

export default function MainCard() {
  const [selectedMonth, setSelectedMonth] = useState<DateTime>(
    DateTime.now().set({day: 1, hour: 0, minute: 0, second: 0, millisecond: 0}),
  );
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [oldTimelogs, setOldTimelogs] = useState<Timelog[]>([]);
  const [oldPerdiems, setOldPerdiems] = useState<Perdiem[]>([]);
  // const [perdiemTypes, setPerdiemTypes] = useState<Object>({});
  const [project, setProject] = useState<string>('');
  const [projectUuid, setProjectUuid] = useState<string | null>(null);
  const [uuidLog, setUuidLog] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [projectShiftModels, setProjectShiftModels] = useState<string[]>([]);
  const [projectShiftModelsAsObject, setProjectShiftModelsAsObject] =
    useState<Object>({});
  const [projectPerdiemtModelsAsObject, setProjectPerdiemtModelsAsObject] =
    useState<Object>({});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      setMonthGetProjectsHandler(selectedMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTimelog = (uuid: string) => {
    setOldTimelogs(oldTimelogs.filter((log) => log.uuid !== uuid));
  };

  const deletePerdiem = (uuid: string) => {
    setOldPerdiems(oldPerdiems.filter((log) => log.uuid !== uuid));
  };

  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  const setMonthGetProjectsHandler = (newDate: DateTime) => {
    setSelectedMonth(newDate);
    let requestPrototype;
    if (newDate !== null) {
      requestPrototype = {
        params: {
          year: newDate.year,
          month: newDate.month,
          format: 'traditional',
          scope: 'me',
        },
      };
      fetchProjects(requestPrototype)
        .then((response) => {
          return response.json();
        })
        .then((projectsResponse) => {
          setAvailableProjects(projectsResponse.projects);
        });
      fetchCurrentMonthLogs(requestPrototype)
        .then((response) => {
          return response.json();
        })
        .then((LogsResponse: Logs) => {
          setOldTimelogs(LogsResponse.timelogs);
          setOldPerdiems(LogsResponse.perdiems);
        });
    }
  };

  const setProjectGetLogsHandler = (event: SelectChangeEvent) => {
    const projectFiltered = availableProjects.filter(
      (project) => project.name === (event.target.value as string),
    );
    setProject(event.target.value as string);
    setProjectUuid(projectFiltered[0].uuid);
    setProjectTypes(Object.keys(projectFiltered[0].worktypes));
    if (projectFiltered[0].worktypes.shift !== undefined) {
      setProjectShiftModels(Object.values(projectFiltered[0].worktypes.shift));
      setProjectShiftModelsAsObject(projectFiltered[0].worktypes.shift);
    }
    if (projectFiltered[0].worktypes.perdiem !== undefined) {
      setProjectPerdiemtModelsAsObject(projectFiltered[0].worktypes.perdiem);
    }
  };

  return (
    <Paper>
      {process.env.NODE_ENV === 'development' && (
        <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
          this card only for testing without backend
          <Button
            onClick={() => {
              setSelectedMonth(selectedMonth);
              setAvailableProjects(_dummy_projects);
              setOldTimelogs(_dummy_old_logs_1.timelogs);
              setOldPerdiems(_dummy_old_logs_1.perdiems);
            }}
          >
            _dummy_1
          </Button>
          <Button
            onClick={() => {
              setSelectedMonth(selectedMonth);
              setAvailableProjects(_dummy_projects);
              setOldTimelogs(_dummy_old_logs_2.timelogs);
              setOldPerdiems(_dummy_old_logs_2.perdiems);
            }}
          >
            _dummy_2
          </Button>
          <Button
            onClick={() => {
              setSelectedMonth(DateTime.fromISO('2001-01-01T00:00'));
            }}
          >
            _dummy_set_Month
          </Button>
        </Card>
      )}
      <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
        {endMonthOpen && (
          <MonthEndDialog
            close={monthEndHandler}
            selectedMonth={selectedMonth}
          />
        )}
        <CardContent>
          <Box sx={{mx: 'auto', textAlign: 'start', p: 3}}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <DatePicker
                  views={['year', 'month']}
                  label='Year and Month'
                  minDate={DateTime.fromISO('2000-01-01T00:00')}
                  maxDate={DateTime.fromISO('2100-01-01T00:00')}
                  value={selectedMonth}
                  onChange={(newValue) => {
                    if (newValue) {
                      setMonthGetProjectsHandler(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </Grid>
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
            </Grid>
          </Box>
        </CardContent>
        <CardActions>
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
        </CardActions>
      </Card>
      <InputCard
        projectPerdiemtModelsAsObject={projectPerdiemtModelsAsObject}
        projectShiftModelsAsObject={projectShiftModelsAsObject}
        types={projectTypes}
        month={selectedMonth}
        uuidProject={projectUuid}
        uuidLog={uuidLog}
        projectShiftModels={projectShiftModels}
      />
      <TimelogItemList
        deleteTimelog={deleteTimelog}
        deletePerdiem={deletePerdiem}
        timelogs={oldTimelogs}
        perdiems={oldPerdiems}
        // perdiemTypes{perdiemTypes}
      />
    </Paper>
  );
}
