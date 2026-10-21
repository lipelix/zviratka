import { expect, type Page } from "@playwright/test";

/** The id of the page marked as the one in view. */
export const activePage = (page: Page): Promise<string | null> =>
  page.evaluate(() => document.querySelector(".page.is-active")?.id ?? null);

export async function open(page: Page, hash = ""): Promise<void> {
  await page.goto(`/${hash}`);
  await expect(page.locator(".page.is-active")).toHaveCount(1);
}

/** Taps the middle of the animal on the page in view. */
export async function tapAnimal(page: Page, id: string): Promise<void> {
  const box = await page.locator(`#${id} .animal .hit`).boundingBox();
  if (!box) throw new Error(`No animal on ${id}`);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

export const playing = (page: Page): Promise<string | null> =>
  page.evaluate(() => window.__player.playing);
