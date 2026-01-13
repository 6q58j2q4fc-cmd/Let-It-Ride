CREATE TABLE `affiliate_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`type` enum('click','booking','order') NOT NULL,
	`referenceId` int,
	`amount` decimal(10,2),
	`commission` decimal(10,2),
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(50) NOT NULL,
	`commissionRate` decimal(5,2) NOT NULL DEFAULT '10',
	`totalClicks` int DEFAULT 0,
	`totalSales` int DEFAULT 0,
	`totalEarnings` decimal(10,2) DEFAULT '0',
	`pendingEarnings` decimal(10,2) DEFAULT '0',
	`paidEarnings` decimal(10,2) DEFAULT '0',
	`status` enum('pending','active','suspended') NOT NULL DEFAULT 'pending',
	`paypalEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featuredImage` text,
	`category` varchar(100),
	`tags` json,
	`seoTitle` varchar(200),
	`seoDescription` text,
	`seoKeywords` text,
	`authorId` int,
	`status` enum('draft','published','scheduled') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`views` int DEFAULT 0,
	`isAiGenerated` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tourId` int NOT NULL,
	`userId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`bookingDate` timestamp NOT NULL,
	`bookingTime` varchar(10) NOT NULL,
	`guests` int NOT NULL DEFAULT 1,
	`totalPrice` decimal(10,2) NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`stripePaymentId` varchar(255),
	`specialRequests` text,
	`affiliateCode` varchar(50),
	`reviewRequested` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed','bogo') NOT NULL,
	`discountValue` decimal(10,2) NOT NULL,
	`minPurchase` decimal(10,2),
	`maxDiscount` decimal(10,2),
	`usageLimit` int,
	`usedCount` int DEFAULT 0,
	`applicableTo` enum('all','tours','products') DEFAULT 'all',
	`isActive` boolean DEFAULT true,
	`expiresAt` timestamp,
	`source` enum('manual','email_signup','game_win','review_reward') DEFAULT 'manual',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `email_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`source` enum('popup','footer','checkout','game') DEFAULT 'popup',
	`couponCode` varchar(50),
	`couponUsed` boolean DEFAULT false,
	`giveawayEntry` boolean DEFAULT false,
	`tripAdvisorReviewed` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `game_plays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(100) NOT NULL,
	`email` varchar(320),
	`userId` int,
	`result` enum('win','lose') NOT NULL,
	`prizeType` enum('discount_10','discount_15','discount_20','discount_25','bogo','free_tour','none'),
	`couponCode` varchar(50),
	`handDetails` json,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_plays_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`shippingAddress` text,
	`items` json NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`discount` decimal(10,2) DEFAULT '0',
	`tax` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`stripePaymentId` varchar(255),
	`couponCode` varchar(50),
	`affiliateCode` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`shortDescription` text,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`salePrice` decimal(10,2),
	`category` enum('cruiser','tandem','cargo','mountain','fat-tire','accessory') NOT NULL,
	`brand` varchar(100) DEFAULT 'Pedego',
	`image` text,
	`gallery` json,
	`features` json,
	`specifications` json,
	`stock` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `review_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerName` varchar(255),
	`sentAt` timestamp,
	`clickedAt` timestamp,
	`reviewedAt` timestamp,
	`giveawayEntered` boolean DEFAULT false,
	`status` enum('pending','sent','clicked','reviewed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('instagram','facebook','both') NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`link` text,
	`tinyUrl` text,
	`affiliateLink` text,
	`hashtags` json,
	`status` enum('queued','posted','failed') NOT NULL DEFAULT 'queued',
	`scheduledAt` timestamp,
	`postedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`shortDescription` text,
	`description` text,
	`duration` varchar(50) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`image` text,
	`highlights` json,
	`included` json,
	`maxGuests` int DEFAULT 10,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tours_id` PRIMARY KEY(`id`),
	CONSTRAINT `tours_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','affiliate') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);