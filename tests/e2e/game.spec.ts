import { expect, test } from "@playwright/test";
import { activePage, open, playing, tapAnimal } from "./helpers";

const IDS = ["krava", "kohout", "lev", "vlk", "zaba"];

test("five animals, the cow first", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await expect(page.locator(".page")).toHaveCount(5);
  expect(
    await page.locator(".page").evaluateAll((p) => p.map((e) => e.id)),
  ).toEqual(IDS);
  expect(await activePage(page)).toBe("krava");
  await expect(page.locator("#krava .name")).toHaveText("Kráva");
  await expect(page.locator(".arrow.prev")).toBeDisabled();
  expect(errors).toEqual([]);
});

test("a tap on the animal plays its sound and animates it", async ({
  page,
}) => {
  await open(page);
  await tapAnimal(page, "krava");
  await expect.poll(() => playing(page)).toBe("krava");
  await expect(page.locator("#krava .animal")).toHaveClass(/is-calling/);
  await expect(page.locator("#krava .call")).toHaveText("Bůůů!");
  // The cow's call is about 3 s long: then it is quiet again.
  await expect(page.locator("#krava .animal")).not.toHaveClass(/is-calling/, {
    timeout: 6000,
  });
  expect(await playing(page)).toBeNull();
});

test("a tap beside the animal only makes it wiggle", async ({ page }) => {
  await open(page);
  const size = page.viewportSize();
  if (!size) throw new Error("No viewport");
  // High in the sky, away from the cow.
  await page.mouse.click(size.width * 0.5, size.height * 0.22);
  await expect(page.locator("#krava .animal")).toHaveClass(/is-hinted/);
  expect(await playing(page)).toBeNull();
});

test("every animal calls on its own page", async ({ page }) => {
  await open(page);
  for (const [i, id] of IDS.entries()) {
    if (i > 0) await page.locator(".arrow.next").click();
    await expect.poll(() => activePage(page)).toBe(id);
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    // Smooth scrolling ends before the tap: the page must sit still.
    await expect
      .poll(() =>
        page.locator(".pager").evaluate((p) => p.scrollLeft % p.clientWidth),
      )
      .toBe(0);
    await tapAnimal(page, id);
    await expect.poll(() => playing(page)).toBe(id);
    await expect(page.locator(`#${id} .animal`)).toHaveClass(/is-calling/);
  }
  await expect(page.locator(".arrow.next")).toBeDisabled();
});

test("a swipe moves to the next animal and stops the sound", async ({
  page,
}) => {
  await open(page);
  await tapAnimal(page, "krava");
  await expect.poll(() => playing(page)).toBe("krava");
  // A swipe is a scroll of the pager: snap points pull it onto the next page.
  await page
    .locator(".pager")
    .evaluate((p) => p.scrollBy({ left: p.clientWidth * 0.7 }));
  await expect.poll(() => activePage(page)).toBe("kohout");
  expect(await playing(page)).toBeNull();
  await expect(page.locator("#krava .animal")).not.toHaveClass(/is-calling/);
});

test("dots, keys and a link pick an animal", async ({ page }) => {
  await open(page, "#vlk");
  expect(await activePage(page)).toBe("vlk");
  await page.locator('.dots button[aria-label="Lev"]').click();
  await expect.poll(() => activePage(page)).toBe("lev");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => activePage(page)).toBe("vlk");
});

test("the info button lists who recorded the sounds", async ({ page }) => {
  await open(page);
  await page.locator(".info").click();
  const dialog = page.locator("dialog.credits");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("li")).toHaveCount(5);
  await expect(dialog).toContainText("CC BY-SA 4.0");
  await dialog.getByRole("button", { name: "Zavřít" }).click();
  await expect(dialog).toBeHidden();
});

test("the animal stays fully in view", async ({ page }) => {
  await open(page);
  const size = page.viewportSize();
  if (!size) throw new Error("No viewport");
  for (const [i, id] of IDS.entries()) {
    await page
      .locator(".pager")
      .evaluate(
        (p, n) => p.scrollTo({ left: n * p.clientWidth, behavior: "instant" }),
        i,
      );
    await expect.poll(() => activePage(page)).toBe(id);
    // The drawn animal (not its generous tap area, nor the hidden breath) must fit.
    const box = await page.locator(`#${id} .animal`).evaluate((g) => {
      const shapes = [
        ...g.querySelectorAll("path, ellipse, circle, rect"),
      ].filter((s) => !s.closest(".hit, .breath, .sac, .blink"));
      const rects = shapes.map((s) => s.getBoundingClientRect());
      return {
        left: Math.min(...rects.map((r) => r.left)),
        right: Math.max(...rects.map((r) => r.right)),
        top: Math.min(...rects.map((r) => r.top)),
        bottom: Math.max(...rects.map((r) => r.bottom)),
      };
    });
    expect(box.left, id).toBeGreaterThanOrEqual(0);
    expect(box.right, id).toBeLessThanOrEqual(size.width);
    expect(box.top, id).toBeGreaterThanOrEqual(0);
    expect(box.bottom, id).toBeLessThanOrEqual(size.height);
  }
});
