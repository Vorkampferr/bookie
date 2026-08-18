import * as cheerio from "cheerio";
import classifiedError, { ErrorCode, checkImpitResponse } from "../error.ts";
import impit from "../impit.ts";
import uniqueID from "../../utils/id.ts";
import type { searchQuery } from "../../types/bot.ts";
import type { bookData, scraperResponse } from "../../types/scraper.ts";

export async function searchQuery(
  query: searchQuery,
): Promise<scraperResponse> {
  let queryResponse: scraperResponse;
  let data: bookData[] = [];

  const response = await impit.fetch(
    `https://www.noor-book.com/?search_for=${query.text}`,
    {
      redirect: "follow",
      method: "GET",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );

  const responseError = checkImpitResponse(response);
  if (responseError) {
    return responseError;
  }

  try {
    const $ = cheerio.load(await response.text());

    const extract = $("a.img-a").each((i: number, elem) => {
      if (!$(elem).attr("href")?.includes("/review")) {
        data.push({
          id: uniqueID(),
          title: $(elem).attr("title")!,
          url: $(elem).attr("href")!,
        });
      }
    });

    if (!extract) {
      return classifiedError(ErrorCode.DATA_PROCESSING_FAILED);
    }
  } catch (error) {
    console.log(error);
    return classifiedError(ErrorCode.UNKNOWN);
  }

  queryResponse = {
    data: {
      id: uniqueID(),
      data: data,
    },
  };

  return queryResponse;
}
