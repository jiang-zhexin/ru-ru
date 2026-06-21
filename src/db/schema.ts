import {
  blob,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const geositeTable = sqliteTable(
  "geosite",
  {
    tag: text("tag").notNull(),
    format: text("format", { enum: ["suffix", "full", "keyword", "regexp"] })
      .notNull(),
    domain: text("domain").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tag, table.format, table.domain] }),
  ],
);

export const geositeTableNew = sqliteTable(
  "geosite_new",
  {
    tag: text("tag").notNull(),
    format: text("format", { enum: ["suffix", "full", "keyword", "regexp"] })
      .notNull(),
    domain: text("domain").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tag, table.format, table.domain] }),
  ],
);

export const geoipTable = sqliteTable(
  "geoip",
  {
    tag: text("tag").notNull(),
    startIp: blob("start_ip", { mode: "buffer" }).notNull(),
    endIp: blob("end_ip", { mode: "buffer" }).notNull(),
    prefixLength: integer("prefix_length").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tag, table.startIp, table.prefixLength] }),
  ],
);

export const geoipTableNew = sqliteTable(
  "geoip_new",
  {
    tag: text("tag").notNull(),
    startIp: blob("start_ip", { mode: "buffer" }).notNull(),
    endIp: blob("end_ip", { mode: "buffer" }).notNull(),
    prefixLength: integer("prefix_length").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.tag, table.startIp, table.prefixLength] }),
  ],
);
