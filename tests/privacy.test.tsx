import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "@/app/privacy/page";

test("privacy page sections", () => {
  render(<PrivacyPage />);
  for (const h of ["What we collect", "Why", "Where it's stored", "Unsubscribe and deletion", "Contact"]) {
    expect(screen.getByRole("heading", { name: h })).toBeInTheDocument();
  }
  expect(screen.getByText(/email address only/)).toBeInTheDocument();
  expect(screen.getByText(/Our email provider \(Resend\), once the waitlist opens\./)).toBeInTheDocument();
});
