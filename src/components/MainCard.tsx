import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
	Button,
	Card,
	CardContent,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
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
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
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

  const deleteTimelog = (uuid: string) => {
    setOldTimelogs(oldTimelogs.filter((log) => log.uuid !== uuid));
  };

  const deletePerdiem = (uuid: string) => {
    setOldPerdiems(oldPerdiems.filter((log) => log.uuid !== uuid));
  };

  const monthEndHandler = () => {
    setEndMonthOpen(false);
  };

  const setMonthGetProjectsHandler = (newDate: Date | null) => {
    setSelectedMonth(newDate);
    let requestPrototype;
    if (newDate !== null) {
      requestPrototype = {
        params: {
          year: newDate.getFullYear(),
          month: newDate.getMonth() + 1,
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
    }
  };
  return (
    <Paper>
      {process.env.NODE_ENV === 'development' && (
        <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
          this card only for testing without backend
          <Button
            onClick={() => {
              setSelectedMonth(new Date());
              setAvailableProjects(_dummy_projects);
              setOldTimelogs(_dummy_old_logs_1.timelogs);
              setOldPerdiems(_dummy_old_logs_1.perdiems);
            }}
          >
            _dummy_1
          </Button>
          <Button
            onClick={() => {
              setSelectedMonth(new Date());
              setAvailableProjects(_dummy_projects);
              setOldTimelogs(_dummy_old_logs_2.timelogs);
              setOldPerdiems(_dummy_old_logs_2.perdiems);
            }}
          >
            _dummy_2
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
            <Grid container spacing={3}>
              <div className='picker'>
                <Typography style={{color: '#838282'}}>Select month</Typography>
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
      <InputCard
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
