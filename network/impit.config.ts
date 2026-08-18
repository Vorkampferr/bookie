import { Browser } from "@crawlee/impit-client";

const impitConfig = {
  browser: Browser.Firefox,
  followRedirects: true,
  maxRedirects: 5,
  vanillaFallback: true,
};

export default impitConfig;
