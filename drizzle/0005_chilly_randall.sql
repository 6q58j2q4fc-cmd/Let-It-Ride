ALTER TABLE `site_images` ADD `mediaType` enum('image','video') DEFAULT 'image' NOT NULL;--> statement-breakpoint
ALTER TABLE `site_images` ADD `thumbnailUrl` text;--> statement-breakpoint
ALTER TABLE `site_images` ADD `duration` int;