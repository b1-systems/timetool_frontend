import { Avatar, Card, CardContent, CardHeader, Chip, Typography } from "@mui/material";
import React from "react";

export default function OutputChip(props: {
  index: number;
  heading: string;
  inversedColor?: boolean;
  //todo type
  Icon: any;
  text: string;
}) {
  return (
    <Card
      elevation={0}
      style={{
        backgroundColor: props.inversedColor
          ? props.index % 2
            ? "#eeeeee"
            : "white"
          : props.index % 2
          ? "white"
          : "#eeeeee",
        padding: 1,
      }}
      //   sx={{
      //     borderTop: 5,
      //     borderLeft: 5,
      //     borderColor: props.inversedColor
      //       ? props.index % 2
      //         ? "white"
      //         : "#eeeeee"
      //       : props.index % 2
      //       ? "#eeeeee"
      //       : "white",
      //     borderTopLeftRadius: 20,
      //     borderTopRightRadius: 20,
      //   }}
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
