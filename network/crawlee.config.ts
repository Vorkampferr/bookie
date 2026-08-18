import { Configuration } from "crawlee";

export function createConfig(): Configuration {
  return new Configuration({
    headless: true,
    availableMemoryRatio: 0.75,
    purgeOnStart: true,
    persistStorage: false,
  });
}

export default createConfig;
