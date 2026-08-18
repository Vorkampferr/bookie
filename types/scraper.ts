import * as cheerio from "cheerio";

export interface scraperData {
  readonly id: string | null;
  readonly data:
    | Uint8Array
    | null
    | string
    | string[]
    | string[][]
    | cheerio.Cheerio<Element>
    | bookData[]
    | scraperResponse;
  readonly title?: string;
  readonly author?: string;
  readonly link?: string | URL;
}

interface scraperError {
  readonly text: string;
  readonly code: number;
}

export interface scraperResponse {
  readonly data: scraperData;
  readonly error?: scraperError;
}

export interface bookData {
  readonly id: string;
  readonly title: string;
  readonly url: string | URL;
}

export interface downloadLinkProps {
  url: string | null;
  type: string | null;
}

export interface playwrightResponse {
  data: any;
  error?: {
    text: string;
    code: number;
  };
}
