// import { toMatchImageSnapshot } from "jest-image-snapshot";
// import { generateImage } from "jsdom-screenshot";
// import { act, fireEvent, render, snapshots } from "../../../test/utils";
import { render } from "../../../test/utils";
import InputCard from "../inputLogs/InputCard";

// const renderInputCard = () => {
//   render(
//     <InputCard
// setProjectUuid={() => {}}
// setUuidLog={() => {}}
// perdiemModels={[]}
// monthIsClosed={false}
// types={[]}
// uuidProject={""}
// uuidLog={""}
// projectShiftModels={[]}
//     />,
//   );
// };

it("test the test", async () => {
  render(
    <InputCard
      setProjectUuid={() => {}}
      setUuidLog={() => {}}
      perdiemModels={[]}
      monthIsClosed={false}
      types={[]}
      uuidProject={""}
      uuidLog={""}
      projectShiftModels={[]}
    />,
  );
  expect(true).toBe(true);
});

// it("renders correctly", async () => {
//   renderInputCard();
//   const screenshot = await generateImage();
//   expect(screenshot).toMatchImageSnapshot();
// });

// test("snaps", async () => {
//   const element = render(<MainGrid />);
//   // await act(async () => {
//   //   fireEvent.click(element.getAllByTestId("DeleteIcon")[0]);
//   // });
// });

// it("renders 3 users", () => {
//   const element = render(<Alerts alerts={allAlerts} simcards={simcards} />);
//   expect(element.getAllByText("user", { exact: false }).length === 3);
// });

// it("renders 7 mails", () => {
//   const element = render(<Alerts alerts={allAlerts} simcards={simcards} />);
//   expect(element.getAllByText("test@example.com", { exact: false }).length === 7);
// });

// it('renders "something went wrong"', () => {
//   const element = render(<Alerts alerts={allAlerts} simcards={simcards} />);
//   expect(element.getAllByText("inactive_due_to_no_resources", { exact: false }));
// });
