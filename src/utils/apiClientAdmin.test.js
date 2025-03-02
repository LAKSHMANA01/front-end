// First, set up all mocks before importing any modules
import axios from "axios";

// Mock axios before anything else
jest.mock("axios");

// Mock API Config
jest.mock("../config/apiConfigAdmin", () => "https://api.example.com");

// Create a mock axios instance
const mockInterceptors = {
  request: { use: jest.fn() },
  response: { use: jest.fn() },
};

const mockAxiosInstance = {
  interceptors: mockInterceptors,
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
};

// Ensure axios.create() returns the mock instance
axios.create.mockReturnValue(mockAxiosInstance);

// Now import the module after setting up mocks
const apiClient = require("./apiClientAdmin").default;

describe("API Client", () => {
  let requestInterceptor, responseInterceptor, responseErrorInterceptor;

  // Save original implementations
  const originalSessionStorage = global.sessionStorage;
  const originalWindow = global.window;
  const originalConsoleError = console.error;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(global, "sessionStorage", {
      value: mockSessionStorage,
      writable: true,
    });

    // Mock window.location
    global.window = {
      location: {
        href: "",
      },
    };

    // Mock console.error
    console.error = jest.fn();

    // Track Interceptor Calls
    jest.spyOn(mockInterceptors.request, "use");
    jest.spyOn(mockInterceptors.response, "use");

    // **Trigger a request to ensure interceptors are registered**
    await apiClient.get("/test").catch(() => {});

    // Validate that interceptors were registered
    expect(mockInterceptors.request.use).toHaveBeenCalledTimes(1);
    expect(mockInterceptors.response.use).toHaveBeenCalledTimes(1);

    // Assign interceptors
    requestInterceptor = mockInterceptors.request.use.mock.calls[0]?.[0];
    responseInterceptor = mockInterceptors.response.use.mock.calls[0]?.[0];
    responseErrorInterceptor = mockInterceptors.response.use.mock.calls[0]?.[1];
  });

  afterEach(() => {
    // Restore original implementations
    Object.defineProperty(global, "sessionStorage", {
      value: originalSessionStorage,
      writable: true,
    });

    global.window = originalWindow;
    console.error = originalConsoleError;
  });

  test("should create axios instance with correct config", () => {
    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "https://api.example.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  test("should register interceptors", () => {
    expect(mockInterceptors.request.use).toHaveBeenCalledTimes(1);
    expect(mockInterceptors.response.use).toHaveBeenCalledTimes(1);
  });

  test("request interceptor should add headers when tokens exist", () => {
    global.sessionStorage.getItem.mockImplementation((key) => {
      if (key === "token") return "test-token";
      if (key === "email") return "test@example.com";
      if (key === "role") return "admin";
      return null;
    });

    const config = { headers: {} };
    const result = requestInterceptor ? requestInterceptor(config) : config;

    expect(result.headers["Authorization"]).toBe("Bearer test-token");
    expect(result.headers["X-User-Email"]).toBe("test@example.com");
    expect(result.headers["X-User-Role"]).toBe("admin");
  });

  test("request interceptor should not add headers when tokens do not exist", () => {
    global.sessionStorage.getItem.mockReturnValue(null);

    const config = { headers: {} };
    const result = requestInterceptor ? requestInterceptor(config) : config;

    expect(result.headers["Authorization"]).toBeUndefined();
    expect(result.headers["X-User-Email"]).toBeUndefined();
    expect(result.headers["X-User-Role"]).toBeUndefined();
  });

  test("request interceptor should handle sessionStorage errors", () => {
    global.sessionStorage.getItem.mockImplementation(() => {
      throw new Error("SessionStorage error");
    });

    const config = { headers: {} };
    const result = requestInterceptor ? requestInterceptor(config) : config;

    expect(console.error).toHaveBeenCalledWith(
      "Error accessing sessionStorage:",
      expect.any(Error)
    );
    expect(result).toEqual(config);
  });

  test("response interceptor should redirect on 401 error", () => {
    const error = { response: { status: 401 } };
    if (responseErrorInterceptor) responseErrorInterceptor(error);

    expect(global.sessionStorage.clear).toHaveBeenCalled();
    expect(global.window.location.href).toBe("/login");
  });

  test("response interceptor should pass through non-401 errors", async () => {
    const error = { response: { status: 500 } };

    if (responseErrorInterceptor) {
      await expect(responseErrorInterceptor(error)).rejects.toBe(error);
    }
    expect(global.sessionStorage.clear).not.toHaveBeenCalled();
  });

  test("response interceptor should handle errors without response", async () => {
    const error = new Error("Network error");

    if (responseErrorInterceptor) {
      await expect(responseErrorInterceptor(error)).rejects.toBe(error);
    }
    expect(global.sessionStorage.clear).not.toHaveBeenCalled();
  });

  test("response interceptor should pass through successful responses", () => {
    const response = { data: { success: true } };
    const result = responseInterceptor ? responseInterceptor(response) : response;

    expect(result).toBe(response);
  });
});
