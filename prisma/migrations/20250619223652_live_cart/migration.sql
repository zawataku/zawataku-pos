-- CreateTable
CREATE TABLE `LiveCart` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `items` JSON NOT NULL,
    `total` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
