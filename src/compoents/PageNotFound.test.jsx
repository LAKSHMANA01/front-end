// PageNotFound.test.jsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageNotFound, { __RewireAPI__ as PageNotFoundRewireAPI } from "./PageNotFound";

// Use fake timers for testing timeouts
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  // Reset any rewired dependencies so tests remain isolated
  PageNotFoundRewireAPI.__ResetDependency__("setIsAnimating");
});

describe("PageNotFound Component Render", () => {
  test("renders the 404 header and description", () => {
    render(<PageNotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page Not Found")).toBeInTheDocument();
  });

  test("renders the image with animate-bounce class when isAnimating is true", () => {
    render(<PageNotFound />);
    const img = screen.getByAltText("Lost in Space");
    expect(img).toHaveClass("animate-bounce");
  });

  test("countdown effect is active (via useEffect)", () => {
    render(<PageNotFound />);
    // The countdown state is internal (starting at 10) and not rendered.
    // We simply advance time to ensure the timeout effects occur without errors.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Component still renders after countdown updates
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});

describe("Internal Functions", () => {
  test("handleGoBack calls window.history.back", () => {
    // Access the internal handleGoBack function via rewire
    const handleGoBack = PageNotFoundRewireAPI.__get__("handleGoBack");
    const historyBackSpy = jest.spyOn(window.history, "back").mockImplementation(() => {});
    act(() => {
      handleGoBack();
    });
    expect(historyBackSpy).toHaveBeenCalled();
    historyBackSpy.mockRestore();
  });

  test("handleRefresh sets isAnimating and calls window.location.reload", () => {
    // Create a mock setter for isAnimating
    const mockSetIsAnimating = jest.fn();
    // Override the internal setIsAnimating using rewire
    PageNotFoundRewireAPI.__set__("setIsAnimating", mockSetIsAnimating);
    const handleRefresh = PageNotFoundRewireAPI.__get__("handleRefresh");

    const reloadSpy = jest.spyOn(window.location, "reload").mockImplementation(() => {});

    // Call handleRefresh
    act(() => {
      handleRefresh();
    });

    // Immediately, setIsAnimating(true) should have been called
    expect(mockSetIsAnimating).toHaveBeenCalledWith(true);

    // Advance timers by 1000ms to trigger the timeout callback
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Then setIsAnimating(false) should have been called
    expect(mockSetIsAnimating).toHaveBeenCalledWith(false);
    // And window.location.reload should have been called
    expect(reloadSpy).toHaveBeenCalled();

    reloadSpy.mockRestore();
  });
});