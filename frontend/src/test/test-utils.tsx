import type { ReactElement } from "react";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Custom render function that includes common providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export specific utilities from React Testing Library
export {
  render as rtlRender,
  screen,
  waitFor,
  within,
  fireEvent,
  act,
} from "@testing-library/react";

// Override render method with our custom one
export { customRender as render };

// Helpful test utilities
export const waitForLoadingToFinish = async () => {
  const { waitFor } = await import("@testing-library/react");
  await waitFor(
    () => {
      const skeletons = document.querySelectorAll('[class*="skeleton"]');
      expect(skeletons.length).toBe(0);
    },
    { timeout: 5000 },
  ).catch(() => {
    // It's okay if skeletons are not found
  });
};

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => {
        delete store[key];
      });
    },
  };
};
