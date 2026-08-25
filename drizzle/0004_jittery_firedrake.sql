CREATE TABLE `production_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` varchar(128) NOT NULL,
	`productId` int,
	`productName` varchar(255) NOT NULL,
	`quantity` decimal(14,3) NOT NULL,
	`unit` varchar(32) NOT NULL DEFAULT 'UN',
	`deliveryDate` varchar(16),
	`priority` varchar(32) NOT NULL DEFAULT 'Normal',
	`status` varchar(32) NOT NULL DEFAULT 'Planejada',
	`linkedOrder` varchar(128),
	`lot` varchar(128),
	`notes` text,
	`authorizationStatus` varchar(32) NOT NULL DEFAULT 'Pendente',
	`materialSeparated` int NOT NULL DEFAULT 0,
	`suppliesSeparated` int NOT NULL DEFAULT 0,
	`productionReleased` int NOT NULL DEFAULT 0,
	`finishedStocked` int NOT NULL DEFAULT 0,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `production_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `production_orders_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `warehouse_requisitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestNumber` varchar(128) NOT NULL,
	`productionOrderId` int,
	`orderNumber` varchar(128),
	`itemKind` enum('rawMaterial','packaging') NOT NULL,
	`itemId` int NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`quantity` decimal(14,3) NOT NULL,
	`unit` varchar(32) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'Pendente',
	`requestedByUserId` int,
	`requestedByName` varchar(128),
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `warehouse_requisitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `warehouse_requisitions_requestNumber_unique` UNIQUE(`requestNumber`)
);
--> statement-breakpoint
ALTER TABLE `production_orders` ADD CONSTRAINT `production_orders_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `production_orders` ADD CONSTRAINT `production_orders_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouse_requisitions` ADD CONSTRAINT `warehouse_requisitions_productionOrderId_production_orders_id_fk` FOREIGN KEY (`productionOrderId`) REFERENCES `production_orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warehouse_requisitions` ADD CONSTRAINT `warehouse_requisitions_requestedByUserId_users_id_fk` FOREIGN KEY (`requestedByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;