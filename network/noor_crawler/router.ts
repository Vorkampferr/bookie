import { createPlaywrightRouter } from "crawlee";
import { scrapeNoorBook } from "./scrape.ts";
import type { playwrightResponse } from "../../types/scraper.ts";

export function createNoorRouter(results: playwrightResponse[]) {
  const router = createPlaywrightRouter();

  router.addDefaultHandler(async ({ page, response, log }) => {
    const result = await scrapeNoorBook(page, response ?? null);
    if (result.error) {
      log.error(result.error.text, {
        code: result.error.code,
        url: page.url(),
      });
    }
    results.push(result);
  });

  return router;
}
