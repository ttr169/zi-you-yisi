CREATE TABLE `learning_events` (
	`user_id` text NOT NULL,
	`id` text NOT NULL,
	`word_id` text NOT NULL,
	`kind` text NOT NULL,
	`at` integer NOT NULL,
	`payload` text NOT NULL,
	PRIMARY KEY(`user_id`, `id`)
);
