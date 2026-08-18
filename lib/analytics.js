"use client";

import { SITE } from "./site";

export function getMeasurementId() {
  return SITE.gaId;
}

export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function trackDownload(fileName, fileType, location) {
  trackEvent("file_download", {
    file_name: fileName,
    file_extension: fileType,
    link_url: location,
    content_group: "research_artifact",
  });
}

export function trackOutbound(url, label) {
  trackEvent("click", {
    event_category: "outbound",
    event_label: label || url,
    link_url: url,
    link_domain: safeHost(url),
  });
}

export function trackResearchView(title, path) {
  trackEvent("research_view", {
    article_title: title,
    page_path: path,
    content_group: "publication",
  });
}

export function trackContact(method) {
  trackEvent("contact_click", {
    method,
  });
}

function safeHost(url) {
  try {
    return new URL(url, SITE.url).hostname;
  } catch {
    return "";
  }
}
