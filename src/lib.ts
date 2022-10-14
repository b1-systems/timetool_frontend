import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { fetchSubmit } from "./api";
import { Incident, Timelog, isPerdiem, isShift, isTimelog } from "./models";

export const handleSubmit = async (timelog: Timelog) => {
  if (timelog) {
    const commonData = {
      uuid: timelog.uuid || uuidv4(),
      project_uuid: timelog.project_uuid,
      start_dt: timelog.start_dt,
      timezone: penis,
    };
    let submitData;
    let incidentsChecked: Incident[] = [];
    if (isShift(timelog)) {
      let overZero = false;
      let lastTimeChecked = -1;
      timelog.incidents.forEach((incident) => {
        if (lastTimeChecked !== -1) {
          if (lastTimeChecked > incident.start_dt) {
            overZero = true;
          }
        }
        if (!overZero) {
          if (incident.end_dt < incident.start_dt) {
            incidentsChecked.push({
              start_dt: incident.start_dt,
              end_dt:
                DateTime.fromSeconds(incident.end_dt).plus({ days: 1 }).valueOf() /
                1000,
              comment: incident.comment,
            });
            lastTimeChecked = incident.end_dt;
            overZero = true;
          } else {
            incidentsChecked.push(incident);
            lastTimeChecked = incident.end_dt;
          }
        } else {
          incidentsChecked.push({
            start_dt:
              DateTime.fromSeconds(incident.start_dt).plus({ days: 1 }).valueOf() /
              1000,
            end_dt:
              DateTime.fromSeconds(incident.end_dt).plus({ days: 1 }).valueOf() / 1000,
            comment: incident.comment,
          });
        }
      });
      submitData = {
        ...commonData,
        end_dt: Math.round(
          DateTime.fromSeconds(timelog.start_dt)
            .set({ hour: 23, minute: 59 })
            .valueOf() / 1000,
        ),
        type: "shift",
        incidents: incidentsChecked,
        shift_model: timelog.shift_model,
      };
      overZero = false;
    } else if (isTimelog(timelog)) {
      submitData = {
        ...commonData,
        end_dt: timelog.end_dt,
        type: "default",
        breakTime: timelog.breaklength,
        travelTime: timelog.travel,
        comment: timelog.comment,
        onsite: timelog.onsite,
      };
    } else if (isPerdiem(timelog)) {
      submitData = {
        ...commonData,
        type: timelog.type,
        comment: timelog.comment,
        is_perdiem: true,
      };
    } else {
      throw new Error("not a valid submit");
    }
    fetchSubmit(submitData).catch((errorNoSubmit: any) => console.error(errorNoSubmit));
  }
};
