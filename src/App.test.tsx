import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the phase 5 drawing workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /tasapainotus/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /draw duct/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /duct network editor canvas/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /critical path/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /parallel branches/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /read-only model preview/i })
    ).toBeInTheDocument();
  });
});
