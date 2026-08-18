import type { Page, Response } from "playwright";
import uniqueID from "../../utils/id.ts";
import classifiedError, { ErrorCode, checkPageResponse } from "../error.ts";
import type { scraperResponse } from "../../types/scraper.ts";

declare const $: any;
declare type T = any;
declare function go_gownload(): void;

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

/**
 @param pageResponse
 */
export async function scrapeNoorBook(
  page: Page,
  pageResponse: Response | null,
): Promise<scraperResponse> {
  const responseError = checkPageResponse(pageResponse);
  if (responseError) {
    return responseError;
  }

  try {
    const hasDownloadTrigger = await page.evaluate(
      () => typeof $ !== "undefined" && typeof go_gownload === "function",
    );

    if (!hasDownloadTrigger) {
      const pageTitle = await page.title();
      const cfChallenge =
        /just a moment|checking your browser|attention required/i.test(
          pageTitle,
        );

      console.error(
        `scrapeNoorBook: download trigger missing. URL: ${page.url()}, title: "${pageTitle}", cfChallenge: ${cfChallenge}`,
      );

      return classifiedError(
        cfChallenge ? ErrorCode.BOT_CHALLENGE : ErrorCode.MARKUP_CHANGED,
      );
    }
    await page.evaluate(() => {
      $("#downloadModal").modal();
      go_gownload();
    });

    let fetchLink: string | null;
    try {
      await page.waitForSelector(".internal_download_link", {
        timeout: 10_000,
      });
      fetchLink = await page
        .locator(".internal_download_link")
        .getAttribute("href");
    } catch (waitError) {
      console.error(
        `scrapeNoorBook: .internal_download_link never appeared at ${page.url()}:`,
        waitError,
      );
      return classifiedError(ErrorCode.DOWNLOAD_LINK_MISSING);
    }

    if (!fetchLink) {
      return classifiedError(ErrorCode.DOWNLOAD_LINK_MISSING);
    }

    const title = await page
      .locator("#trans_title_here")
      .innerText()
      .catch(() => undefined);
    const author =
      (await page
        .locator("#book-writer")
        .innerText({ timeout: 2000 })
        .catch(() => undefined)) ||
      (await page.locator("td", { hasText: "كاتب غير محدد" }).innerText());

    const downloadUrl = fetchLink.startsWith("http")
      ? fetchLink
      : new URL(fetchLink, page.url()).toString();

    let base64Data: { base64: string; contentLength: string | null };
    try {
      base64Data = await page.evaluate(async (targetUrl) => {
        const res = await fetch(targetUrl, { credentials: "include" });
        if (!res.ok) {
          throw new Error(
            `Download fetch failed: ${res.status} ${res.statusText}`,
          );
        }
        const contentLength = res.headers.get("content-length");
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);

        let binary = "";
        for (let i = 0; i < bytes.length; i += 0x8000) {
          const chunk = bytes.subarray(i, i + 0x8000);
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }

        return { base64: btoa(binary), contentLength };
      }, downloadUrl);
    } catch (fetchError) {
      console.error(
        `scrapeNoorBook: file fetch failed for ${downloadUrl}:`,
        fetchError,
      );
      return classifiedError(ErrorCode.FILE_SERVER_ERROR);
    }

    const buffer = Buffer.from(base64Data.base64, "base64");
    const contentLength = Number(base64Data.contentLength ?? buffer.byteLength);

    if (
      contentLength > MAX_FILE_SIZE_BYTES ||
      buffer.byteLength > MAX_FILE_SIZE_BYTES
    ) {
      return classifiedError(ErrorCode.FILE_TOO_LARGE);
    }

    if (buffer.byteLength === 0) {
      return classifiedError(ErrorCode.FILE_EMPTY);
    }

    return {
      data: {
        id: uniqueID(),
        data: buffer,
        title,
        author,
      },
    };
  } catch (error) {
    console.error(
      `scrapeNoorBook: unclassified failure at ${page.url()}:`,
      error,
    );
    return classifiedError(ErrorCode.UNKNOWN);
  }
}
