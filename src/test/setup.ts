import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Vitest does not expose lifecycle hooks globally by default, so clean up
// rendered React trees explicitly between tests.
afterEach(() => {
  cleanup();
});
