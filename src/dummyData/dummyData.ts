//data to simulate backend responses
import { Logs, Project } from "../models";

export const _dummy_projects: Project[] = [
  {
    uuid: "618e8681-9bb8-4c26-9ae3-86516d67120b",
    name: "test1",
    worktypes: {
      perdiem: {
        3: "GAAAAANZ LANGER STRING 1234567890 16 € Anreise ab 3 Mon",
        4: "VMA Ausland",
        5: "32 € 24h ab 3 Mon",
        6: "16 € Anreise ab 3 Mon",
        7: "14 € VMA Anreise",
        8: "28 € VMA 24h",
      },
      timelog: {
        timelog: "timelog",
      },
      shift: {
        morning: "Frühschicht",
        afternoon: "Nachmittag",
        night: "Nachtschicht",
      },
    },
  },
  {
    uuid: "618e8681-9bb8-4c26-9ae3-86516d67120c",
    name: "test2",
    worktypes: {
      timelog: {
        timelog: "timelog",
      },
    },
  },
  {
    uuid: "623f481-9bb8-4c26-9ae3-86516d67120b",
    name: "test3",
    worktypes: {
      perdiem: {
        1: "VMA Ausland",
        2: "0 € 24h ab 3 Mon",
        3: "99 € Anreise ab 3 Mon",
      },
      timelog: {
        timelog: "timelog",
      },
      shift: {
        morning: "Frühschicht",
      },
    },
  },
];

export const _dummy_old_logs_1: Logs = {
  timelogs: [
    {
      //e.g. default
      uuid: "61b846d5-c33c-4751-8feb-2d0f2068c51e",
      employee_uuid: "61b846c6-2d44-42c4-83ba-2d0f2068c51e",
      project_uuid: "618e86a1-dfc0-4025-84f8-86516d67120b",
      project_name: "test2 - default",
      start_dt: 1625119200,
      end_dt: 1625151600,
      type: "default",
      breaklength: 3600,
      travel: "0",
      comment: "SAP Unicorn - Telefonica",
      onsite: "onsite",
    },
    {
      //e.g. default
      uuid: "61c846d5-c33c-4751-8feb-2d0f2068c52e",
      employee_uuid: "61b846c6-2d44-42c4-83ba-2f0f2068c51e",
      project_uuid: "618e86a1-dfc0-4025-84f8-86616d67120b",
      project_name: "test2 - shift",
      start_dt: 1625110200,
      end_dt: 1625150600,
      type: "shift",
      incidents: [
        {
          start_dt: 123,
          end_dt: 123666,
          comment: "mitteilung1",
        },
        {
          start_dt: 123234,
          end_dt: 123234666,
          comment: "mitteilung1",
        },
        {
          start_dt: 1232345,
          end_dt: 123234666,
          comment: "mitteilung1",
        },
      ],
      shift_model: "morning",
    },
    {
      //e.g. default
      uuid: "61d846d5-c33c-4751-8feb-2d0f2068c52e",
      employee_uuid: "61b846c6-2d44-42c4-83ba-2f0f2068c51e",
      project_uuid: "618e86a1-dfc0-4025-84f8-86616d67120b",
      project_name: "test1  - shift - no inc",
      start_dt: 1625110200,
      end_dt: 1625150600,
      type: "shift",
      shift_model: "morning",
    },
    {
      //e.g. default
      uuid: "61g846d5-c33c-4751-8feb-2d0f2068c52e",
      employee_uuid: "61b846c6-2d44-42c4-83ba-2f0f2068c51e",
      project_uuid: "618e86a1-dfc0-4025-84f8-86616d67120b",
      project_name: "test2 - shift - incidents: [],",
      start_dt: 1625110200,
      end_dt: 1625150600,
      type: "shift",
      incidents: [],
      shift_model: "morning",
    },
  ],
  perdiems: [
    {
      //e.g. perdiem
      uuid: "a41cdbe1-e271-45f4-8644-07ed650d7a50",
      project_name: "Test2 perdiem",
      start_dt: 1626566400,
      employee_uuid: "61b846c6-2d44-42c4-83ba-2d0f2068c51e",
      type: 7,
      project_uuid: "618e86a1-dfc0-4025-84f8-86516d67120b",
      comment: "Dresden - Unicorn Meetings - Anreise",
    },
  ],
};

export const _dummy_old_logs_2: Logs = {
  timelogs: [
    {
      uuid: "61b846d5-c33s-4751-8feb-2d0f2068c51e",
      employee_uuid: "61b846h6-2d44-42c4-83ba-2d0f2068c51e",
      project_uuid: "618e86r1-dfc0-4025-84f8-86516d67120b",
      project_name: "test1 - default",
      start_dt: 1625129200,
      end_dt: 1625191600,
      type: "default",
      breaklength: 3600,
      travel: "0",
      comment: "SAP Unicorn - Telefonica",
      onsite: "onsite",
    },
    {
      uuid: "61b846f5-c33c-4751-8feb-2d0f2068c52e",
      employee_uuid: "61b846s6-2d44-42c4-83ba-2f0f2068c51e",
      project_uuid: "618g86a1-dfc0-4025-84f8-86616d67120b",
      project_name: "test1 - shift",
      start_dt: 1725110200,
      end_dt: 1725150600,
      type: "shift",
      incidents: [
        {
          start_dt: 1625110200,
          end_dt: 1625110300,
          comment: "mitteilung1",
        },
        {
          start_dt: 1625110350,
          end_dt: 1625110400,
          comment: "mitteilung1",
        },
        {
          start_dt: 1625110300,
          end_dt: 1625110400,
          comment: "mitteilung1",
        },
      ],
      shift_model: "morning",
    },
    {
      uuid: "71b846d5-c33c-4751-8feb-2d0g2068c51e",
      employee_uuid: "91b846c6-2d44-42g4-83ba-2d0f2068c51e",
      project_uuid: "018e86a1-dfg0-4025-84f8-86516d67120b",
      project_name: "test1 - default",
      start_dt: 1825119200,
      end_dt: 1825151600,
      type: "default",
      breaklength: 3600,
      travel: "0",
      comment:
        "SAP Unicorn - Telefonica GAAAANZ LANGER STRING 1293768q7zdfisajkchblhjkaghfed",
      onsite: "onsite",
    },
    {
      uuid: "21y846d5-c33c-4751-8feb-2d0f2068c52e",
      employee_uuid: "31b846c6-2d44-42c4-83ba-2f0f2068c51e",
      project_uuid: "418e86a1-dfc0-4025-84f8-86616d67120b",
      project_name: "test1 - shift",
      start_dt: 1425110200,
      end_dt: 1425150600,
      type: "shift",
      incidents: [
        {
          start_dt: 123,
          end_dt: 123666,
          comment: "mitteilung1",
        },
        {
          start_dt: 123234,
          end_dt: 123234666,
          comment: "mitteilung1",
        },
        {
          start_dt: 1232345,
          end_dt: 123234666,
          comment: "mitteilung1",
        },
      ],
      shift_model: "morning",
    },
  ],
  perdiems: [
    {
      uuid: "a41cdbe1-e271-45f4-8644-07ed650d7a50",
      project_name: "Test2 perdiem",
      start_dt: 1626566400,
      employee_uuid: "61b846c6-2d44-42c4-83ba-2d0f2068c51e",
      type: 7,
      project_uuid: "618e86a1-dfc0-4025-84f8-86516d67120b",
      comment: "Dresden - Unicorn Meetings - Anreise",
    },
    {
      uuid: "a51cdbe1-e271-45f4-8644-07ed650d7a50",
      project_name: "Test2 perdiem",
      start_dt: 1676566400,
      employee_uuid: "61b946c6-2d44-42c4-83ba-2d0f2068c51e",
      type: 8,
      project_uuid: "618e56a1-dfc0-4025-84f8-86516d67120b",
      comment: "Dresden - Unicorn Meetings - Anreise",
    },
  ],
};
