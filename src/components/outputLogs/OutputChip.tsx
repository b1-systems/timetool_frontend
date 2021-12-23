import { Avatar, Card, CardContent, CardHeader, Chip, Typography } from "@mui/material";
import React from "react";

export default function OutputChip(props: {
  index: number;
  heading: string;
  Icon: React.ReactNode;
  text: string;
}) {
  return (
    <Card
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
        <Typography variant="body1" align="center">
          {props.text}
        </Typography>
      </CardContent>
    </Card>
  );
}
