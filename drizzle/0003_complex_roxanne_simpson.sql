ALTER TABLE `stock_movements` ADD `externalId` varchar(96) NOT NULL;--> statement-breakpoint
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_externalId_unique` UNIQUE(`externalId`);