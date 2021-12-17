import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { TopBar } from '@b1-systems/react-components';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FeedIcon from '@mui/icons-material/Feed';
import PersonIcon from '@mui/icons-material/Person';
import {
	ListItemButton,
	ListItemText,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';

import MainCard from './MainCard';

const drawerWidth = 240;

const Timelog = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const mediumOrLargerDisplay = useMediaQuery(theme.breakpoints.up('sm'));
  const extraLargeDisplay = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <CssBaseline />
        <TopBar
          applicationTitle='Timelog'
          menuOnClick={() => setDrawerOpen(!drawerOpen)}
          //todo notificationHistory={[]}
          //todo languageMenu={[]}
        />
        <Drawer
          variant={
            extraLargeDisplay
              ? drawerOpen
                ? 'permanent'
                : 'temporary'
              : 'temporary'
          }
          open={extraLargeDisplay ? drawerOpen : !drawerOpen}
          onClose={() => setDrawerOpen(!drawerOpen)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{overflow: 'auto'}}>
            <List>
              <Link color='inherit' href='/' underline='hover'>
                <ListItemButton>
                  <ListItemIcon>
                    <CalendarTodayIcon fontSize='large' />
                  </ListItemIcon>
                  <ListItemText primary='Timelog' />
                </ListItemButton>
              </Link>
              <Link
                color='inherit'
                href={`${globalThis.horde.appWebroot}/employee/projects`}
                underline='hover'
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon fontSize='large' />
                  </ListItemIcon>
                  <ListItemText primary='My Projects' />
                </ListItemButton>
              </Link>
              <Link
                color='inherit'
                href={`${globalThis.horde.appWebroot}/result/`}
                underline='hover'
              >
                <ListItemButton>
                  <ListItemIcon>
                    <FeedIcon fontSize='large' />
                  </ListItemIcon>
                  <ListItemText primary='Results' />
                </ListItemButton>
              </Link>
              <Link
                color='inherit'
                href={`${globalThis.horde.appWebroot}/admin/`}
                underline='hover'
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize='large' />
                  </ListItemIcon>
                  <ListItemText primary='Administrator' />
                </ListItemButton>
              </Link>
            </List>
          </Box>
        </Drawer>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          <Toolbar />
          <MainCard />
        </Box>
      </Box>
    </>
  );
};

export default Timelog;
