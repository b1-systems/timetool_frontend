import { Logs, Project } from "../../models";

export const projectsListEmpty: Project[] = [];
export const projectsListOne: Project[] = [
  {
    uuid: "618e8691-b290-4214-a64d-86516d67120b",
    name: "Shift Project",
    worktypes: {
      shift: {
        morning: "Fr\u00fchschicht",
        afternoon: "Nachmittag",
        night: "Nachtschicht",
      },
    },
  },
];
export const projectsList: Project[] = [
  {
    uuid: "618e8691-b290-4214-a64d-86516d67120b",
    name: "Shift Project",
    worktypes: {
      shift: {
        morning: "Fr\u00fchschicht",
        afternoon: "Nachmittag",
        night: "Nachtschicht",
      },
    },
  },
  {
    uuid: "61e6bb44-27a0-4da6-9265-0106ac120003",
    name: "Demo Project 1",
    worktypes: {
      perdiem: {
        "4": "VMA Ausland",
        "5": "32 \u20ac 24h ab 3 Mon",
        "6": "16 \u20ac Anreise ab 3 Mon",
        "7": "14 \u20ac VMA Anreise",
        "8": "28 \u20ac VMA 24h",
      },
      timelog: { timelog: "timelog" },
    },
  },
  {
    uuid: "61e6bc30-a448-4366-9f96-0106ac120003",
    name: "Demo Project 2",
    worktypes: {
      perdiem: {
        "1": "testMeTypeofDemo2",
        "4": "VMA Ausland",
        "5": "32 \u20ac 24h ab 3 Mon",
        "6": "16 \u20ac Anreise ab 3 Mon",
        "7": "14 \u20ac VMA Anreise",
        "8": "28 \u20ac VMA 24h",
      },
      timelog: { timelog: "timelog" },
    },
  },
];
export const timelogsEmpty: Logs = {
  timelogs: [],
  perdiems: [],
};
export const timelogs: Logs = {
  timelogs: [
    {
      uuid: "ba7ac69f-3a1f-483d-8a0a-ef240a192e51",
      employee_uuid: "61efa3d2-9bb4-4380-883e-0121ac150003",
      project_uuid: "61e6bb44-27a0-4da6-9265-0106ac120003",
      project_name: "Demo Project 1",
      start_dt: 1640995800,
      end_dt: 1641000000,
      type: "default",
      breaklength: 0,
      travel: 0,
      comment: "1",
      onsite: "remote",
    },
    {
      uuid: "89bb9b28-3c2a-48e7-992a-7122491b4ab6",
      employee_uuid: "61efa3d2-9bb4-4380-883e-0121ac150003",
      project_uuid: "61e6bb44-27a0-4da6-9265-0106ac120003",
      project_name: "Demo Project 1",
      start_dt: 1641600600,
      end_dt: 1641604800,
      type: "default",
      breaklength: 0,
      travel: 0,
      comment: "1",
      onsite: "remote",
    },
    {
      uuid: "74302355-496e-4350-bc75-a428aef4b232",
      employee_uuid: "61efa3d2-9bb4-4380-883e-0121ac150003",
      project_uuid: "618e8691-b290-4214-a64d-86516d67120b",
      project_name: "Shift Project",
      start_dt: 1641013200,
      end_dt: 1641013200,
      type: "shift",
      shift_model: "morning",
      incidents: [
        { comment: "1", start_dt: 1640995440, end_dt: 1641003360 },
        { comment: "2", start_dt: 1641004200, end_dt: 1641009540 },
      ],
    },
  ],
  perdiems: [
    {
      uuid: "fea39fbb-2798-429f-b0f8-22c83a6ec219",
      employee_uuid: "61efa3d2-9bb4-4380-883e-0121ac150003",
      project_uuid: "61e6bc30-a448-4366-9f96-0106ac120003",
      project_name: "Demo Project 2",
      start_dt: 1641078000,
      type: 1,
      comment: "testMePerdiem",
    },
  ],
};
