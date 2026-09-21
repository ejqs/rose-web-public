import { doublePrecision, integer, pgTable, text } from "drizzle-orm/pg-core";

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

export const jevAnalyses = pgTable("jev_analyses", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  articleId: integer("article_id")
    .notNull()
    .references(() => articles.id),
  entityKey: text("entity_key"),
  claimSpan: text("claim_span"),
  scope: text("scope").notNull(),
  taxonomyVersion: text("taxonomy_version").notNull(),
  model: text("model").notNull(),
  answers: text("answers").notNull(),
  inputTokenEstimate: integer("input_token_estimate"),
  createdAt: text("created_at").notNull(),
});

export const articleGeoSentiment = pgTable("article_geo_sentiment", {
  articleId: integer("article_id")
    .primaryKey()
    .references(() => articles.id),
  countryIso: text("country_iso"),
  countryName: text("country_name"),
  region: text("region"),
  sentiment: text("sentiment").notNull(),
  confidence: doublePrecision("confidence"),
  aboutCountry: doublePrecision("about_country"),
  eligible: integer("eligible").notNull().default(0),
  taxonomyVersion: text("taxonomy_version").notNull(),
  model: text("model").notNull(),
  analyzedAt: text("analyzed_at").notNull(),
});
