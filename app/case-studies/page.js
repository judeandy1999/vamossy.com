import React from 'react';
import { generatePageMetadata } from "@/utils/seo";
import CaseStudiesClient from './CaseStudiesClient';

export const metadata = generatePageMetadata({
  title: "Case Studies | Vamossy Digital",
  description: "Real results from real clients. See how we've helped eCommerce brands overcome challenges and achieve measurable growth.",
  url: "/case-studies",
  noIndex: true // This will prevent indexing
});

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}