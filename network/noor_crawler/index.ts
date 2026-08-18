import { PlaywrightCrawler, log as crawleeLog } from "crawlee";
import { createNoorRouter } from "./router.ts";
import uniqueID from "../../utils/id.ts";
import createConfig from "../crawlee.config.ts";
import { ERROR_MESSAGES, ErrorCode } from "../error.ts";
import type { playwrightResponse } from "../../types/scraper.ts";

crawleeLog.setLevel(crawleeLog.LEVELS.ERROR);

const crawlNoor = async (url: URL | string): Promise<playwrightResponse[]> => {
  const results: playwrightResponse[] = [];
  const router = createNoorRouter(results);
  const config = createConfig();

  const crawler = new PlaywrightCrawler(
    {
      requestHandler: router,
      retryOnBlocked: true,
      maxRequestRetries: 3,
      useSessionPool: true,
      persistCookiesPerSession: true,
      sessionPoolOptions: {
        maxPoolSize: 10,
      },

      browserPoolOptions: {
        useFingerprints: true,
        fingerprintOptions: {
          fingerprintGeneratorOptions: {
            browsers: ["chrome"],
            devices: ["desktop"],
            operatingSystems: ["windows"],
          },
        },
      },

      launchContext: {
        launchOptions: {
          headless: true,
        },
      },

      requestHandlerTimeoutSecs: 60,
    },
    config,
  );

  try {
    await crawler.run([`${url}`]);
  } catch (error) {
    console.error(`crawlNoor crawler run failed for ${url}:`, error);
  }

  if (results.length === 0) {
    results.push({
      data: { id: uniqueID(), data: null },
      error: {
        text: ERROR_MESSAGES[ErrorCode.PAGE_UNREACHABLE] || "",
        code: ErrorCode.PAGE_UNREACHABLE,
      },
    });
  }

  return results;
};

export default crawlNoor;
