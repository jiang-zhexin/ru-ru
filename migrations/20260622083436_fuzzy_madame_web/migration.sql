CREATE TABLE `geoip` (
	`tag` text NOT NULL,
	`start_ip` blob NOT NULL,
	`end_ip` blob NOT NULL,
	`prefix_length` integer NOT NULL,
	CONSTRAINT `geoip_pk` PRIMARY KEY(`tag`, `start_ip`, `prefix_length`)
);
--> statement-breakpoint
CREATE TABLE `geoip_new` (
	`tag` text NOT NULL,
	`start_ip` blob NOT NULL,
	`end_ip` blob NOT NULL,
	`prefix_length` integer NOT NULL,
	CONSTRAINT `geoip_new_pk` PRIMARY KEY(`tag`, `start_ip`, `prefix_length`)
);
--> statement-breakpoint
CREATE TABLE `geosite` (
	`tag` text NOT NULL,
	`format` text NOT NULL,
	`domain` text NOT NULL,
	CONSTRAINT `geosite_pk` PRIMARY KEY(`tag`, `format`, `domain`)
);
--> statement-breakpoint
CREATE TABLE `geosite_new` (
	`tag` text NOT NULL,
	`format` text NOT NULL,
	`domain` text NOT NULL,
	CONSTRAINT `geosite_new_pk` PRIMARY KEY(`tag`, `format`, `domain`)
);
