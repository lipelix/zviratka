import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ANIMALS } from "./animals";

describe("animals", () => {
  it("has five animals with unique ids", () => {
    expect(ANIMALS).toHaveLength(5);
    expect(new Set(ANIMALS.map((a) => a.id)).size).toBe(ANIMALS.length);
  });

  it("ships a sound for every animal", () => {
    for (const animal of ANIMALS)
      expect(existsSync(`public/sounds/${animal.id}.mp3`), animal.id).toBe(
        true,
      );
  });

  it("credits every recording; only public domain may go without a licence link", () => {
    for (const { credit, id } of ANIMALS) {
      expect(credit.source, id).toMatch(
        /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
      );
      expect(credit.author, id).not.toBe("");
      if (credit.licence !== "Public domain")
        expect(credit.licenceUrl, id).toMatch(
          /^https:\/\/creativecommons\.org\//,
        );
    }
  });
});
