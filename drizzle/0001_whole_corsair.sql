CREATE TABLE `packaging_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`packagingType` varchar(64) NOT NULL,
	`size` varchar(64),
	`unit` varchar(32) NOT NULL DEFAULT 'UN',
	`unitCost` decimal(14,3) DEFAULT '0',
	`minimumStock` decimal(14,3) DEFAULT '0',
	`active` int NOT NULL DEFAULT 1,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packaging_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `packaging_items_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `production_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(96) NOT NULL,
	`productionOrderNumber` varchar(128) NOT NULL,
	`sector` varchar(64) NOT NULL,
	`received` decimal(14,3) DEFAULT '0',
	`sent` decimal(14,3) DEFAULT '0',
	`loss` decimal(14,3) DEFAULT '0',
	`temperature` decimal(8,2),
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `production_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `production_entries_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(128),
	`unit` varchar(32) NOT NULL DEFAULT 'UN',
	`salePrice` decimal(14,3) DEFAULT '0',
	`shelfLifeDays` int,
	`storageTemperature` varchar(64),
	`minimumStock` decimal(14,3) DEFAULT '0',
	`active` int NOT NULL DEFAULT 1,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `raw_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(128),
	`unit` varchar(32) NOT NULL DEFAULT 'KG',
	`unitCost` decimal(14,3) DEFAULT '0',
	`minimumStock` decimal(14,3) DEFAULT '0',
	`supplier` varchar(255),
	`active` int NOT NULL DEFAULT 1,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raw_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `raw_materials_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemKind` enum('product','rawMaterial','packaging') NOT NULL,
	`itemId` int NOT NULL,
	`movementType` enum('Entrada','Saída','Ajuste') NOT NULL,
	`quantity` decimal(14,3) NOT NULL,
	`unit` varchar(32) NOT NULL,
	`origin` varchar(128),
	`destination` varchar(128),
	`lot` varchar(128),
	`note` text,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `packaging_items` ADD CONSTRAINT `packaging_items_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `production_entries` ADD CONSTRAINT `production_entries_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;