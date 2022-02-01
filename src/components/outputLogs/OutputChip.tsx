import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

export default function OutputChip(props: {
  index: number;
  heading: string;
  Icon: React.ReactNode;
  text: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}) {
  return (
    <Grid
      item
      xs={props.xs || 12}
      component={Card}
      sm={props.sm || 6}
      md={props.md || 6}
      lg={props.lg || 2}
      elevation={0}
      style={{
        backgroundColor: props.index % 2 ? "white" : "#eeeeee",
        padding: 0,
        borderRadius: 0,
        boxShadow: "none",
      }}
      sx={{
        border: 1,
        borderColor: "#dedede",
      }}
    >
      <CardHeader
        style={{ padding: 0 }}
        disableTypography={true}
        title={
          <Chip
            sx={{
              backgroundColor: props.index % 2 ? "white" : "#eeeeee",
            }}
            label={props.heading}
            avatar={<Avatar sx={{ width: 32, height: 32 }}>{props.Icon}</Avatar>}
          />
        }
      ></CardHeader>
      <CardContent style={{ padding: 2 }}>
        <Typography variant="body1" align="center" noWrap={false}>
          {props.text}
        </Typography>
      </CardContent>
    </Grid>
  );
}
