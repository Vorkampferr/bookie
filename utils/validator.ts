import hostnames from "../network/hostnames.ts";
import type { downloadLinkProps } from "../types/scraper.ts";

export function validateURL(urlString: string | null): downloadLinkProps {
  if (urlString == null || !urlString) {
    return {
      url: null,
      type: null,
    };
  }

  const regex = /^\/dl_([a-zA-Z0-9]{10})$/;
  const isCommand = regex.test(urlString);

  if (isCommand) {
    return {
      url: urlString,
      type: "command",
    };
  }

  let url = urlString.startsWith("https://")
    ? new URL(urlString)
    : new URL("https://" + urlString);

  if (!hostnames.includes(url.host)) {
    return {
      url: null,
      type: null,
    };
  }

  return {
    url: url.toString(),
    type: "url",
  };
}
