import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const newsSources = pgTable("news_sources", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  feedUrl: text("feed_url"),
  scrapeMethod: text("scrape_method").notNull().default("rss"),
  status: text("status").notNull().default("unknown"),
  robotsCheckedAt: text("robots_checked_at"),
  robotsTtlUntil: text("robots_ttl_until"),
  robotsBody: text("robots_body"),
  crawlDelaySeconds: integer("crawl_delay_seconds"),
  lastSuccessAt: text("last_success_at"),
  lastAttemptAt: text("last_attempt_at"),
  lastError: text("last_error"),
  priority: integer("priority").notNull().default(0),
  nextEligibleAt: text("next_eligible_at").notNull(),
  articlesScrapedCount: integer("articles_scraped_count").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const articles = pgTable("articles", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  sourceId: integer("source_id")
    .notNull()
    .references(() => newsSources.id),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  bodyText: text("body_text").notNull(),
  publishedAt: text("published_at"),
  scrapedAt: text("scraped_at").notNull(),
  contentHash: text("content_hash").notNull(),
  lang: text("lang"),
  rawMetadata: text("raw_metadata"),
  jevStatus: text("jev_status").notNull().default("skipped"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
