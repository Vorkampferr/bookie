import uniqueID from "../utils/id.ts";
import { type Response } from "playwright";
import { type ImpitResponse } from "impit";
import type { scraperResponse } from "../types/scraper.ts";

export const ErrorCode = {
  PAGE_NOT_FOUND: 1101,
  PAGE_UNREACHABLE: 1102,
  BOT_CHALLENGE: 1103,
  MARKUP_CHANGED: 1104,
  DOWNLOAD_LINK_MISSING: 1105,
  FILE_SERVER_ERROR: 1106,
  FILE_TOO_LARGE: 1107,
  FILE_EMPTY: 1108,
  REQUEST_FAILED: 1109,
  DATA_PROCESSING_FAILED: 1110,
  UNKNOWN: 1199,
} as const;

function errorResponse(text: string, code: number): scraperResponse {
  return {
    data: { id: uniqueID(), data: null },
    error: { text, code },
  };
}

export const ERROR_MESSAGES: Record<number, string> = {
  [ErrorCode.PAGE_NOT_FOUND]:
    "عذراً.. لم يتم العثور على هذا الكتاب. تأكد من صحة الرابط.",
  [ErrorCode.PAGE_UNREACHABLE]:
    "عذراً.. تعذر الوصول إلى الموقع حالياً. حاول مرة أخرى بعد قليل.",
  [ErrorCode.BOT_CHALLENGE]:
    "عذراً.. الموقع يمنع الوصول التلقائي مؤقتاً. حاول مرة أخرى بعد قليل.",
  [ErrorCode.MARKUP_CHANGED]:
    "عذراً.. حدث تغيير في الموقع يمنعنا من إتمام التحميل حالياً. تم إبلاغ المطور.",
  [ErrorCode.DOWNLOAD_LINK_MISSING]:
    "عذراً.. تعذر العثور على رابط التحميل لهذا الكتاب.",
  [ErrorCode.FILE_SERVER_ERROR]:
    "عذراً.. فشل تحميل الملف من الخادم. حاول مرة أخرى.",
  [ErrorCode.FILE_TOO_LARGE]:
    "عذراً.. حجم هذا الملف أكبر من الحد المسموح به لإرساله عبر تيليجرام (50 ميجابايت).",
  [ErrorCode.FILE_EMPTY]:
    "عذراً.. تم تحميل ملف فارغ. حاول مرة أخرى أو أبلغ المطور.",
  [ErrorCode.REQUEST_FAILED]: "عذراً.. فشل الطلب.",
  [ErrorCode.DATA_PROCESSING_FAILED]: "عذراً.. حصل خطأ أثناء معالجة البيانات.",
  [ErrorCode.UNKNOWN]: "عذراً.. حدث خطأ غير متوقع.",
};

function classifiedError(code: number): scraperResponse {
  const msg = (ERROR_MESSAGES[code] ??
    ERROR_MESSAGES[ErrorCode.UNKNOWN]) as string;
  return errorResponse(msg, code);
}

export function checkPageResponse(
  response: Response | null,
): scraperResponse | null {
  if (!response) {
    return classifiedError(ErrorCode.PAGE_UNREACHABLE);
  }
  if (response.status() === 404) {
    return classifiedError(ErrorCode.PAGE_NOT_FOUND);
  }
  if (response.status() >= 500) {
    return classifiedError(ErrorCode.PAGE_UNREACHABLE);
  }
  return null;
}

export function checkImpitResponse(
  response: ImpitResponse | null,
): scraperResponse | null {
  if (!response) {
    return classifiedError(ErrorCode.PAGE_UNREACHABLE);
  }
  if (response.status === 404) {
    return classifiedError(ErrorCode.PAGE_NOT_FOUND);
  }
  if (response.status >= 500) {
    return classifiedError(ErrorCode.PAGE_UNREACHABLE);
  }
  return null;
}

export default classifiedError;
