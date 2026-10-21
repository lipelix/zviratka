import { describe, expect, it } from "vitest";
import { pageAt, pageFromHash } from "./pager";

describe("pager", () => {
  it("snaps to the nearest page", () => {
    expect(pageAt(0, 400, 5)).toBe(0);
    expect(pageAt(190, 400, 5)).toBe(0);
    expect(pageAt(210, 400, 5)).toBe(1);
    expect(pageAt(1600, 400, 5)).toBe(4);
  });

  it("stays inside the pages, also while bouncing past the ends", () => {
    expect(pageAt(-80, 400, 5)).toBe(0);
    expect(pageAt(2100, 400, 5)).toBe(4);
    expect(pageAt(100, 0, 5)).toBe(0);
    expect(pageAt(100, 400, 0)).toBe(0);
  });

  it("opens the page named in the hash", () => {
    const ids = ["krava", "kohout", "lev"];
    expect(pageFromHash("#lev", ids)).toBe(2);
    expect(pageFromHash("kohout", ids)).toBe(1);
    expect(pageFromHash("", ids)).toBe(0);
    expect(pageFromHash("#slon", ids)).toBe(0);
  });
});
