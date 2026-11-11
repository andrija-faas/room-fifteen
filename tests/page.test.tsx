import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import Comparison from "@/components/Comparison";
import Faq from "@/components/Faq";

test("brief copy present", () => {
  render(
    <>
      <Hero />
      <Pricing />
      <Marquee />
    </>,
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/We bring efficiency\s*to your gambling\./i);
  expect(
    screen.getByText("We only take 1% commission unlike the real casinos that take all."),
  ).toBeInTheDocument();
  expect(screen.getAllByText("Saving 100% of your time for 1% of your money").length).toBeGreaterThan(0);
  expect(
    screen.getByText(/Calculate your losses in advance and stop wasting your precious time gambling\./),
  ).toBeInTheDocument();
});

test("CTA targets waitlist", () => {
  render(<Hero />);
  expect(screen.getByRole("link", { name: "Run the simulation" })).toHaveAttribute("href", "#waitlist");
});

test("sample bill totals", () => {
  render(<Pricing />);
  expect(screen.getByText("€125,249.00")).toBeInTheDocument();
  expect(screen.getByText("€1,252.49")).toBeInTheDocument();
  expect(screen.getByText("€126,501.49")).toBeInTheDocument();
});

test("comparison outcome row", () => {
  render(<Comparison />);
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getAllByText("You lose")).toHaveLength(2);
});

test("faq admits it is satire", () => {
  render(<Faq />);
  expect(screen.getByText("Is this a joke?")).toBeInTheDocument();
  expect(screen.getByText(/Room Fifteen is satire/)).toBeInTheDocument();
});

test("footer has help link and satire disclaimer", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: /BeGambleAware/ })).toHaveAttribute(
    "href",
    "https://www.begambleaware.org/",
  );
  expect(screen.getByText(/satire and not a gambling service/)).toBeInTheDocument();
});
