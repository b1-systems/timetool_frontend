import { DateTime, Duration } from "luxon";

import * as api from "../../api";
import { editUUID } from "../../atoms/edit";
import { selectedProjectUUID } from "../../atoms/projects";
import { RecoilStateSetter, flushPromisesAndTimers, render } from "../../test/utils";
import InputCard from "./InputCard";

function mockEssentialApi() {
    jest.spyOn(api, "fetchProjects").mockResolvedValue([
        {
            name: "Mock Project 1",
            uuid: "616a757c-1a10-470b-aee1-6835b4c8f879",
            worktypes: {
                perdiem: {
                    0: "Mock Perdiem 0 1",
                    1: "Mock Perdiem 1 1",
                    2: "Mock Perdiem 2 1",
                },
                timelog: {
                    timelog: "Mock Timelog 1",
                },
                shift: {
                    morning: "Mock Morning Shift 1",
                    afternoon: "Mock Afternoon Shift 1",
                    night: "Mock Night Shift 1",
                },
            },
        },
    ]);
    jest.spyOn(api, "fetchCurrentMonthLogs").mockResolvedValue({
        perdiems: [],
        timelogs: [
            {
                uuid: "fa5b8224-f4bd-4f02-a357-5165b5e68e7b",
                type: "timelog",
                comment: "Some default timelog work",
                project_name: "Mock Project 1",
                project_uuid: "616a757c-1a10-470b-aee1-6835b4c8f879",
                employee_uuid: "f4509934-37dc-4022-b198-c4cf949bf89e",
                startTime: DateTime.now().startOf("day"),
                endTime: DateTime.now().endOf("day"),
                breakTime: Duration.fromMillis(0),
                travelTime: Duration.fromMillis(0),
                site: "remote",
            },
        ],
    });
    jest.spyOn(api, "fetchIsMonthClosed").mockResolvedValue(false);
}

describe("InputCard", () => {
    it("contains select project notice", async () => {
        jest.useFakeTimers();
        mockEssentialApi();

        const { queryByTestId } = render(
            <>
                <RecoilStateSetter node={selectedProjectUUID} value={null} />
                <InputCard />
            </>,
        );

        await flushPromisesAndTimers();
        const notice = queryByTestId("InputCard--Notice--Select-Project");
        const worktypeSelect = queryByTestId("InputCard--Worktype--Select");
        expect(notice).toBeInTheDocument();
        expect(worktypeSelect).not.toBeInTheDocument();
    });

    it("contains select project notice", async () => {
        jest.useFakeTimers();
        mockEssentialApi();

        const { queryByTestId } = render(
            <>
                <RecoilStateSetter
                    node={selectedProjectUUID}
                    value={"616a757c-1a10-470b-aee1-6835b4c8f879"}
                />
                <InputCard />
            </>,
        );

        await flushPromisesAndTimers();
        const notice = queryByTestId("InputCard--Notice--Select-Project");
        const worktypeSelect = queryByTestId("InputCard--Worktype--Select");
        expect(notice).not.toBeInTheDocument();
        expect(worktypeSelect).toBeInTheDocument();
    });

    it("contains cancel edit button", async () => {
        jest.useFakeTimers();
        mockEssentialApi();

        const { queryByTestId } = render(
            <>
                <RecoilStateSetter
                    node={selectedProjectUUID}
                    value={"616a757c-1a10-470b-aee1-6835b4c8f879"}
                />
                <RecoilStateSetter
                    node={editUUID}
                    value={"fa5b8224-f4bd-4f02-a357-5165b5e68e7b"}
                />
                <InputCard />
            </>,
        );

        await flushPromisesAndTimers();
        const editButton = queryByTestId("CancelEditButton--button");
        expect(editButton).toBeInTheDocument();
    });

    it("doesn't contain cancel edit button", async () => {
        jest.useFakeTimers();
        mockEssentialApi();

        const { queryByTestId } = render(
            <>
                <RecoilStateSetter
                    node={selectedProjectUUID}
                    value={"616a757c-1a10-470b-aee1-6835b4c8f879"}
                />
                <RecoilStateSetter node={editUUID} value={null} />
                <InputCard />
            </>,
        );

        await flushPromisesAndTimers();
        const editButton = queryByTestId("CancelEditButton--button");
        expect(editButton).not.toBeInTheDocument();
    });
});
