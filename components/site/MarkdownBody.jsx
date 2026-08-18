"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { rewriteHref } from "@/lib/links";

export default function MarkdownBody({ children }) {
  return (
    <div className="research-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ href, children: label }) => {
            const next = rewriteHref(href || "");
            const external = /^https?:\/\//i.test(next);
            if (external) {
              return (
                <a href={next} rel="noopener noreferrer">
                  {label}
                </a>
              );
            }
            return <Link href={next || "#"}>{label}</Link>;
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={rewriteHref(src || "")} alt={alt || ""} loading="lazy" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
