import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

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
  const [projectUuid, setProjectUuid] = useState<string>('');
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
  };

  const handleTest = () => {
    console.log(selectedMoth);
    console.log(project);
    console.log(projectUuid);
    console.log(projectTypes);
  };

  return (
    <Container component='main'>
      <Paper>
        <Card elevation={0} sx={{border: 1, borderColor: 'grey.300'}}>
          <Button onClick={handleTest}>Test</Button>
          <CardContent>
            <Box sx={{mx: 'auto', textAlign: 'center', p: 5}}>
              <Grid container spacing={3}>
                <div className='picker'>
                  <Typography>Selcet month:</Typography>
                  <DatePicker
                    id='datePicker'
                    wrapperClassName='datePicker'
                    dateFormat='LLLL/yy'
                    selected={selectedMoth}
                    showMonthYearPicker
                    showFullMonthYearPicker
                    showTwoColumnMonthYearPicker
                    onChange={(newDate: Date | null) =>
                      setSelectedMonth(newDate)
                    }
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
              uuid={projectUuid}
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
                          <StyledTableCell align='right'>
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
                            <StyledTableCell align='right'>
                              edit/copy/delete
                            </StyledTableCell>
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
    </Container>
  );
}
/**
<TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {resourcesPerAlert && <StyledTableCell>{t("resource")}</StyledTableCell>}
              <StyledTableCell>{t("limit")}</StyledTableCell>
              <StyledTableCell align="center">
                {t("deactivate_card_question")}
              </StyledTableCell>
              <StyledTableCell align="center">{t("send_e-mail")}</StyledTableCell>
              <StyledTableCell align="center">{t("actions")}</StyledTableCell>
              {resourcesPerAlert && <StyledTableCell>{t("user")}</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.uuid}>
                {resourcesPerAlert && (
                  <TableCell>
                    <List>
                      {resourcesPerAlert.get(alert.uuid)?.length !== 0 ? (
                        // @ts-ignore Cannot be undefined due to check above
                        resourcesPerAlert.get(alert.uuid).map((resource) => (
                          <ListItem disablePadding key={resource}>
                            <ListItemText>{resource}</ListItemText>
                          </ListItem>
                        ))
                      ) : (
                        <i>{t("inactive_due_to_no_resources")}</i>
                      )}
                    </List>
                  </TableCell>
                )}
                <TableCell>
                  <Chip
                    onClick={() => {
                      setAlertUuidToUpdateLimitOf(alert.uuid);
                    }}
                    icon={<DataUsageIcon />}
                    label={`${alert.limitmib} MB`}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    onClick={() =>
                      confirm({
                        msg: alert.deactivateCard
                          ? t(
                              "disable_deactivation_of_all_cards_when_limit_is_reached_question",
                            )
                          : t(
                              "enable_deactivation_of_all_cards_when_limit_is_reached_question",
                            ),
                        onConfirm: () => {
                          toggleAlertDeactivateCard(alert.uuid).then(() => {
                            toasty.success("setting_successfully_changed");
                            updateAlerts();
                          });
                        },
                      })
                    }
                    color={alert.deactivateCard ? "warning" : "default"}
                    label={alert.deactivateCard ? t("yes") : t("no")}
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack spacing={1}>
                    {alert.recipients.map((recipient) => (
                      <Chip
                        key={recipient}
                        size="small"
                        onDelete={() =>
                          confirm({
                            msg: t("do_you_really_want_to_remove_the_recipient"),
                            onConfirm: () =>
                              removeEmailFromAlert(alert.uuid, recipient).then(() => {
                                updateAlerts();
                                toasty.warning(
                                  t("recipient_has_been_removed", {
                                    recipient: recipient,
                                  }),
                                );
                              }),
                          })
                        }
                        label={recipient}
                      />
                    ))}
                    <Chip
                      key="email_add"
                      size="small"
                      onClick={() => {
                        setAlertUuidToAddEmailTo(alert.uuid);
                      }}
                      icon={<AddIcon />}
                      label={t("add")}
                    />
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  {simcardIccid ? (
                    <IconButton
                      color="error"
                      onClick={() =>
                        confirm({
                          msg: t(
                            "are_you_sure_you_want_to_unlink_the_alert_from_the_card",
                          ),
                          onConfirm: () => {
                            unlinkAlertFromCard(simcardIccid, alert.uuid).then(() => {
                              updateAlerts();
                              updateSIMCards();
                              toasty.warning(t("alert_has_been_unlinked_from_card"));
                            });
                          },
                        })
                      }
                    >
                      <LinkOffIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="error"
                      onClick={() =>
                        confirm({
                          msg: t("are_you_sure_you_want_to_delete_the_alert"),
                          onConfirm: () => {
                            deleteAlert(alert.uuid).then(() => {
                              updateAlerts();
                              toasty.warning(t("alert_has_been_deleted"));
                            });
                          },
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
                {resourcesPerAlert && <TableCell>{alert.createdBy}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      */
