"use client";

import { trackDownload, trackOutbound, trackContact } from "@/lib/analytics";

export default function ArtifactLinks({ items }) {
  return (
    <ul className="artifact-links">
      {items.map((item) => {
        const external = item.href.startsWith("http");
        return (
          <li key={item.href + item.label}>
            <a
              href={item.href}
              className="artifact-link"
              download={!external && item.download ? true : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={() => {
                if (item.kind === "contact") trackContact(item.method || "email");
                else if (external) trackOutbound(item.href, item.label);
                else trackDownload(item.fileName || item.label, item.fileType || "", item.href);
              }}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
