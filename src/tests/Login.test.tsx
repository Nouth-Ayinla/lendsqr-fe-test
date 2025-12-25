import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";

// Mock the api module
vi.mock("../services/api", () => ({
  api: {
    login: vi.fn(),
  },
}));

describe("Login Component", () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("should render login form", () => {
    renderLogin();

    expect(screen.getByText("Welcome!")).toBeInTheDocument();
    expect(screen.getByText("Enter details to login.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should have a forgot password link", () => {
    renderLogin();

    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });
});
