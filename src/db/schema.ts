import {
  bytea,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const format = pgEnum("format_enum", [
  "suffix",
  "full",
  "keyword",
  "regexp",
]);

export const geositeTable = pgTable(
  "geosite",
  {
    tag: text("tag").notNull(),
    format: format("format").notNull(),
    domain: text("domain").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tag, table.format, table.domain] }),
  ],
);

export const geoipTable = pgTable(
  "geoip",
  {
    tag: text("tag").notNull(),
    startIp: bytea("start_ip").notNull(),
    endIp: bytea("end_ip").notNull(),
    prefixLength: integer("prefix_length").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tag, table.startIp, table.prefixLength] }),
  ],
);
