/*
  Warnings:

  - You are about to drop the `LiveCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `LiveCart`;

-- CreateTable
CREATE TABLE `SessionCart` (
    `id` VARCHAR(191) NOT NULL,
    `items` JSON NOT NULL,
    `total` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
