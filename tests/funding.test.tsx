import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import FundingBlock from "@/components/FundingBlock";

test("hidden without url", () => {
  const { container } = render(<FundingBlock />);
  expect(container).toBeEmptyDOMElement();
});

test("link with url", () => {
  render(<FundingBlock url="https://ko-fi.com/x" />);
  const a = screen.getByRole("link", { name: "Fund development" });
  expect(a).toHaveAttribute("href", "https://ko-fi.com/x");
  expect(a).toHaveAttribute("target", "_blank");
  expect(a).toHaveAttribute("rel", "noopener noreferrer");
  expect(
    screen.getByText("This is a joke, but you can still fund the further development of this project."),
  ).toBeInTheDocument();
});
