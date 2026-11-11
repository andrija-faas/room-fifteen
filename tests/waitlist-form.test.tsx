import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WaitlistForm from "@/components/WaitlistForm";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const respond = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

test("closed shows notice, no input", () => {
  render(<WaitlistForm open={false} />);
  expect(screen.getByText("Waitlist opens soon.")).toBeInTheDocument();
  expect(screen.queryByLabelText("Email")).toBeNull();
});

test("invalid email shows inline error, no fetch", async () => {
  const user = userEvent.setup();
  render(<WaitlistForm open />);
  await user.type(screen.getByLabelText("Email"), "gary");
  await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
  expect(await screen.findByText("That doesn't look like an email. Even we have standards.")).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

test("success replaces form and posts email + honeypot", async () => {
  fetchMock.mockReturnValue(respond(200, { ok: true }));
  const user = userEvent.setup();
  render(<WaitlistForm open />);
  await user.type(screen.getByLabelText("Email"), " Gary@Example.com ");
  await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
  expect(await screen.findByText("You're on the list. Your losses have been reserved.")).toBeInTheDocument();
  expect(screen.queryByLabelText("Email")).toBeNull();
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/waitlist");
  expect(init.method).toBe("POST");
  expect(JSON.parse(init.body)).toEqual({ email: "gary@example.com", company: "" });
});

test("double click sends one request", async () => {
  fetchMock.mockReturnValue(new Promise(() => {}));
  const user = userEvent.setup();
  render(<WaitlistForm open />);
  await user.type(screen.getByLabelText("Email"), "a@b.co");
  const button = screen.getByRole("button", { name: "Join the waitlist" });
  await user.dblClick(button);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Joining…" })).toBeDisabled();
});

test("server error message shown", async () => {
  fetchMock.mockReturnValue(respond(503, { error: "Waitlist opens soon." }));
  const user = userEvent.setup();
  render(<WaitlistForm open />);
  await user.type(screen.getByLabelText("Email"), "a@b.co");
  await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
  expect(await screen.findByText("Waitlist opens soon.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Join the waitlist" })).toBeEnabled();
});

test("network failure shows fallback", async () => {
  fetchMock.mockRejectedValue(new TypeError("offline"));
  const user = userEvent.setup();
  render(<WaitlistForm open />);
  await user.type(screen.getByLabelText("Email"), "a@b.co");
  await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
  expect(await screen.findByText("Couldn't reach the house. Try again.")).toBeInTheDocument();
});

test("error clears when typing", async () => {
  const user = userEvent.setup();
  render(<WaitlistForm open />);
  const input = screen.getByLabelText("Email");
  await user.type(input, "gary");
  await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
  await screen.findByText("That doesn't look like an email. Even we have standards.");
  await user.type(input, "@");
  expect(screen.queryByText("That doesn't look like an email. Even we have standards.")).toBeNull();
});

test("consent line links to privacy", () => {
  render(<WaitlistForm open />);
  expect(screen.getByText(/We'll email you when the simulator launches\. Unsubscribe anytime\./)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
});

test("honeypot input does not look like an autofillable field", () => {
  const { container } = render(<WaitlistForm open />);
  const inputs = Array.from(container.querySelectorAll("input"));
  const honeypot = inputs.find((i) => i.type !== "email")!;
  expect(honeypot).toBeDefined();
  const hints = [honeypot.name, honeypot.id, honeypot.autocomplete, honeypot.labels?.[0]?.textContent ?? ""]
    .join(" ")
    .toLowerCase();
  expect(hints).not.toMatch(/company|organi[sz]ation|org|name|email|tel|address/);
});
