import { TopBar, useToasty } from "@b1-systems/react-components";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FeedIcon from "@mui/icons-material/Feed";
import PersonIcon from "@mui/icons-material/Person";
import {
    LinearProgress,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

import MainGrid from "./MainGrid";
import ErrorFallback from "./common/ErrorFallback";

const drawerWidth = 240;
interface Props {
    supportedLanguages: ReadonlyMap<string, string>;
}

/**
 * Set Topbar and Drawer from @b1-systems/react-components
 *
 * unusual use of Drawer component:
 * The drawer uses two conditional arguments to determine how big the screen is and if the drawer should be visible or not,
 * this is achieved with the variant JSX attribute, which sets the drawer to the "permanent" or "temporary" variant and checks if drawerOpen is true.
 */

const OuterMenu = (props: Props) => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const extraLargeDisplay = useMediaQuery(theme.breakpoints.up("xl"));
    const { toasty } = useToasty();
    const { t, i18n } = useTranslation();
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <CssBaseline />
                <TopBar
                    applicationTitle={t("timelog")}
                    menuOnClick={() => setDrawerOpen(!drawerOpen)}
                    //todo notificationHistory={[]}
                    languageMenu={{
                        currentLanguage: i18n.language,
                        onLanguageChange: (key: string) => {
                            i18n.changeLanguage(key)
                                .then(() => toasty.info(t("changed_language")))
                                .catch((error) => {
                                    console.error(error);
                                    toasty.error(
                                        "an_error_occurred.could_not_change_language",
                                    );
                                });
                        },
                        entries: Array.from(props.supportedLanguages).map(
                            ([key, value]) => ({
                                key: key,
                                display: value,
                            }),
                        ),
                    }}
                />
                <Drawer
                    variant={
                        extraLargeDisplay
                            ? drawerOpen
                                ? "permanent"
                                : "temporary"
                            : "temporary"
                    }
                    open={extraLargeDisplay ? drawerOpen : !drawerOpen}
                    onClose={() => setDrawerOpen(!drawerOpen)}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: "auto" }}>
                        <List>
                            <Link
                                // this component makes this routing client-side, i.e. it happens inside react
                                // the component requires `to` instead of `href`
                                component={RouterLink}
                                color="inherit"
                                to={"/ui/entry"}
                                underline="hover"
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CalendarTodayIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText primary={t("timelog")} />
                                </ListItemButton>
                            </Link>
                            <Link
                                color="inherit"
                                href={`${globalThis.horde.appWebroot}/employee/projects`}
                                underline="hover"
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PersonIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText primary={t("my_projects")} />
                                </ListItemButton>
                            </Link>
                            <Link
                                color="inherit"
                                href={`${globalThis.horde.appWebroot}/result/`}
                                underline="hover"
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <FeedIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText primary={t("results")} />
                                </ListItemButton>
                            </Link>
                            <Link
                                color="inherit"
                                href={`${globalThis.horde.appWebroot}/admin/`}
                                underline="hover"
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AdminPanelSettingsIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText primary={t("administrator")} />
                                </ListItemButton>
                            </Link>
                        </List>
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                    }}
                >
                    <Toolbar />
                    <Suspense fallback={<LinearProgress />}>
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                            <MainGrid />
                        </ErrorBoundary>
                    </Suspense>
                </Box>
            </Box>
        </>
    );
};

export default OuterMenu;
