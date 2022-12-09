import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { fetchSubmit } from "./api";
import { DefaultTimelog, Incident, Perdiem, Shift } from "./models/internal";

type PartialPick<T, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;

type PartialPerdiem = PartialPick<
  Perdiem,
  "type" | "uuid" | "employee_uuid" | "project_name"
>;
export const submitPerdiem = (timelog: PartialPerdiem) =>
  fetchSubmit({
    is_perdiem: true,
    uuid: timelog.uuid || uuidv4(),
    timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
    project_uuid: timelog.project_uuid,
    start_dt: timelog.startTime.toSeconds() | 0,
    type: timelog.perdiemModel,
    comment: timelog.comment,
  });

type PartialDefaultTimelog = PartialPick<
  DefaultTimelog,
  "type" | "uuid" | "employee_uuid" | "project_name"
>;
export const submitDefaultTimelog = (timelog: PartialDefaultTimelog) =>
  fetchSubmit({
    type: "default",
    uuid: timelog.uuid || uuidv4(),
    timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
    project_uuid: timelog.project_uuid,
    start_dt: timelog.startTime.toSeconds() | 0,
    end_dt: timelog.endTime.toSeconds() | 0,
    breakTime: timelog.breakTime.as("minutes") | 0,
    travelTime: timelog.travelTime.as("minutes") | 0,
    comment: timelog.comment,
    onsite: timelog.site,
  });

type PartialShift = PartialPick<
  Shift,
  "type" | "uuid" | "employee_uuid" | "project_name" | "endTime"
>;
export const submitShift = (timelog: PartialShift) => {
  let incidentsChecked: Incident[] = [];
  let lastTimeChecked = DateTime.fromMillis(-1);

  for (let incident of timelog.incidents) {
    let overZero = false;
    if (lastTimeChecked.toMillis() !== -1) {
      if (lastTimeChecked > incident.startTime) {
        overZero = true;
      }
    }

    if (!overZero) {
      if (incident.endTime < incident.startTime) {
        // Roll over to next if end time is before start time
        incidentsChecked.push({
          startTime: incident.startTime,
          endTime: incident.endTime.plus({ days: 1 }),
          comment: incident.comment,
        });
        lastTimeChecked = incident.endTime;
        overZero = true;
      } else {
        // Otherwise, just add the incident
        incidentsChecked.push(incident);
        lastTimeChecked = incident.endTime;
      }
    } else {
      // If we've already rolled over, add the incident to the next day
      incidentsChecked.push({
        startTime: incident.startTime.plus({ days: 1 }),
        endTime: incident.endTime.plus({ days: 1 }),
        comment: incident.comment,
      });
    }
  }

  return fetchSubmit({
    type: "shift",
    uuid: timelog.uuid || uuidv4(),
    timezone: window.Intl.DateTimeFormat().resolvedOptions().timeZone,
    project_uuid: timelog.project_uuid,
    start_dt: timelog.startTime.toSeconds() | 0,
    end_dt: timelog.startTime.endOf("day").toSeconds() | 0,
    shift_model: timelog.shiftModel,
    incidents: incidentsChecked.map((incident) => ({
      start_dt: incident.startTime.toSeconds() | 0,
      end_dt: incident.endTime.toSeconds() | 0,
      comment: incident.comment,
    })),
  });
};
