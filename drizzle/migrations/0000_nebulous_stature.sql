CREATE TABLE `Address` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`zipCode` varchar(20) NOT NULL,
	CONSTRAINT `Address_id` PRIMARY KEY(`id`),
	CONSTRAINT `Address_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `Customer` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`addressId` bigint unsigned NOT NULL,
	`telephone` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `Customer_id` PRIMARY KEY(`id`),
	CONSTRAINT `Customer_id_unique` UNIQUE(`id`),
	CONSTRAINT `Customer_addressId_unique` UNIQUE(`addressId`)
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`ts` bigint NOT NULL,
	`customerId` bigint unsigned NOT NULL,
	`stripeID` varchar(255) NOT NULL,
	`total` float NOT NULL,
	`done` boolean,
	`delivery` boolean NOT NULL DEFAULT false,
	CONSTRAINT `Order_id` PRIMARY KEY(`id`),
	CONSTRAINT `Order_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrderProductLine` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`orderId` bigint unsigned NOT NULL,
	`productId` bigint unsigned NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `OrderProductLine_id` PRIMARY KEY(`id`),
	CONSTRAINT `OrderProductLine_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `Products` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`ts` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`descriptionEn` text,
	`price` int NOT NULL,
	`boughtPrice` int,
	`waitingForCollect` boolean,
	`quantity` int NOT NULL,
	`image` varchar(255) NOT NULL,
	`sexe` varchar(255) NOT NULL,
	`size` varchar(255) NOT NULL,
	`brand` varchar(255) NOT NULL,
	`etat` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`tags` json,
	`creation` bigint NOT NULL,
	`favorite` boolean NOT NULL,
	`composition` json,
	CONSTRAINT `Products_id` PRIMARY KEY(`id`),
	CONSTRAINT `Products_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `Request` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`ts` bigint NOT NULL,
	`customerId` bigint unsigned NOT NULL,
	`description` text NOT NULL,
	`done` boolean,
	CONSTRAINT `Request_id` PRIMARY KEY(`id`),
	CONSTRAINT `Request_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `WebsiteConfig` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`locked` boolean NOT NULL,
	`popUpAddressId` bigint unsigned NOT NULL,
	`freeShipping` int NOT NULL,
	`delayDelivery` varchar(255),
	`promoFr` varchar(255) NOT NULL,
	`promoEn` varchar(255) NOT NULL,
	CONSTRAINT `WebsiteConfig_id` PRIMARY KEY(`id`),
	CONSTRAINT `WebsiteConfig_id_unique` UNIQUE(`id`),
	CONSTRAINT `WebsiteConfig_popUpAddressId_unique` UNIQUE(`popUpAddressId`)
);
--> statement-breakpoint
CREATE INDEX `address_idx` ON `Address` (`id`);--> statement-breakpoint
CREATE INDEX `customer_idx` ON `Customer` (`id`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `Order` (`id`);--> statement-breakpoint
CREATE INDEX `orderProductLine_idx` ON `OrderProductLine` (`id`);--> statement-breakpoint
CREATE INDEX `products_idx` ON `Products` (`id`);--> statement-breakpoint
CREATE INDEX `request_idx` ON `Request` (`id`);--> statement-breakpoint
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_addressId_Address_id_fk` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_Customer_id_fk` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrderProductLine` ADD CONSTRAINT `OrderProductLine_orderId_Order_id_fk` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrderProductLine` ADD CONSTRAINT `OrderProductLine_productId_Products_id_fk` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Request` ADD CONSTRAINT `Request_customerId_Customer_id_fk` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `WebsiteConfig` ADD CONSTRAINT `WebsiteConfig_popUpAddressId_Address_id_fk` FOREIGN KEY (`popUpAddressId`) REFERENCES `Address`(`id`) ON DELETE no action ON UPDATE no action;