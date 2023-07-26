-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(20) NOT NULL,
    `avator` VARCHAR(100) NOT NULL DEFAULT '',
    `birthday` DATETIME(0) NULL,
    `create_time` DATETIME(0) NOT NULL,
    `email` VARCHAR(50) NOT NULL DEFAULT '',
    `gender` VARCHAR(1) NOT NULL DEFAULT '',
    `login_name` VARCHAR(50) NOT NULL DEFAULT '',
    `name` VARCHAR(50) NOT NULL DEFAULT '',
    `nickname` VARCHAR(50) NOT NULL DEFAULT '',
    `password` VARCHAR(100) NOT NULL DEFAULT '',
    `phone` VARCHAR(13) NOT NULL DEFAULT '',
    `update_time` DATETIME(0) NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `login_name_UNIQUE`(`login_name`),
    UNIQUE INDEX `phone_UNIQUE`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
