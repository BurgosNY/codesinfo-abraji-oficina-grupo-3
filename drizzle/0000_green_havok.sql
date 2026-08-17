CREATE TABLE `curators` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`active` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experts` (
	`id` text PRIMARY KEY NOT NULL,
	`university_id` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`department` text NOT NULL,
	`area` text NOT NULL,
	`specialties` text NOT NULL,
	`summary` text NOT NULL,
	`email` text,
	`phone` text,
	`profile_url` text NOT NULL,
	`source_label` text NOT NULL,
	`verified_at` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `experts_status_idx` ON `experts` (`status`);--> statement-breakpoint
CREATE INDEX `experts_university_idx` ON `experts` (`university_id`);--> statement-breakpoint
CREATE INDEX `experts_name_idx` ON `experts` (`name`);--> statement-breakpoint
CREATE TABLE `universities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`acronym` text NOT NULL,
	`state` text NOT NULL,
	`directory_url` text NOT NULL,
	`directory_label` text NOT NULL,
	`notes` text NOT NULL,
	`is_active` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
