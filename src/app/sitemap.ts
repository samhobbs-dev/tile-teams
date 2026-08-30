import type { MetadataRoute } from "next";
import { CURRENT_YEAR, FIRST_YEAR } from "@/const/const";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const yearEntries: MetadataRoute.Sitemap = [];
  for (let year = FIRST_YEAR; year <= CURRENT_YEAR; year++) {
    yearEntries.push({
      url: `https://www.tileteams.com/year/${year}`,
      lastModified,
      changeFrequency: year === CURRENT_YEAR ? "weekly" : "yearly",
      priority: year === CURRENT_YEAR ? 0.9 : 0.5,
    });
  }

  return [
    {
      url: "https://www.tileteams.com",
      lastModified,
      changeFrequency: 'monthly',
      priority: 1
    },
    ...yearEntries,
  ];
}