CREATE TYPE "format_enum" AS ENUM('suffix', 'full', 'keyword', 'regexp');--> statement-breakpoint
CREATE TABLE "geoip" (
	"tag" text,
	"start_ip" bytea,
	"end_ip" bytea NOT NULL,
	"prefix_length" integer,
	CONSTRAINT "geoip_pkey" PRIMARY KEY("tag","start_ip","prefix_length")
);
--> statement-breakpoint
CREATE TABLE "geosite" (
	"tag" text,
	"format" "format_enum",
	"domain" text,
	CONSTRAINT "geosite_pkey" PRIMARY KEY("tag","format","domain")
);
