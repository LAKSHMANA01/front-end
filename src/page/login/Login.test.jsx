import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import apiClient from "../../config/apiConfig";
import { ToastContainer } from "react-toastify";

jest.mock("../../utils/apiClient", () => ({
    post: jest.fn(),
}));

describe("Login Component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Login />
                <ToastContainer />
            </MemoryRouter>
        );
    });

    test("renders login form correctly", () => {
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("displays an error message when login fails", async () => {
        apiClient.post.mockRejectedValueOnce({
            response: { data: { error: "Invalid email or password" } },
        });

        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
            target: { value: "wrongpassword" },
        });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
        });
    });

    test("redirects to dashboard on successful login", async () => {
        const mockResponse = {
            data: {
                success: true,
                token: "mock-token",
                email: "user@example.com",
                role: "admin",
            },
        };
        apiClient.post.mockResolvedValueOnce(mockResponse);

        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(sessionStorage.getItem("token")).toBe("mock-token");
            expect(sessionStorage.getItem("email")).toBe("user@example.com");
            expect(sessionStorage.getItem("role")).toBe("admin");
        });
    });
});
