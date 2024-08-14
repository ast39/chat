-- CreateTable
CREATE TABLE `chat_users` (
    `user_id` VARCHAR(36) NOT NULL,
    `user_name` VARCHAR(128) NULL,
    `user_avatar` VARCHAR(128) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_chat_rooms` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(128) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_chats` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(128) NULL,
    `status` ENUM('active', 'blocked') NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_chat_users` (
    `chat_id` INTEGER UNSIGNED NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`chat_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `reply_to` INTEGER UNSIGNED NULL,
    `chat_id` INTEGER UNSIGNED NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `content` TEXT NULL,
    `status` ENUM('active', 'blocked') NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_message_versions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `message_id` INTEGER UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_attachment_types` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_attachments` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type_id` INTEGER UNSIGNED NOT NULL,
    `path` VARCHAR(128) NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `ext` VARCHAR(16) NOT NULL,
    `size` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_message_attachments` (
    `message_id` INTEGER UNSIGNED NOT NULL,
    `attachment_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`message_id`, `attachment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_claims` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `chat_id` INTEGER UNSIGNED NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `author_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `body` TEXT NOT NULL,
    `status` ENUM('active', 'rejected', 'completed') NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_reactions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `message_id` INTEGER UNSIGNED NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `content` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat_chats` ADD CONSTRAINT `chat_chats_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `chat_chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_chat_users` ADD CONSTRAINT `chat_chat_users_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chat_chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_chat_users` ADD CONSTRAINT `chat_chat_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `chat_users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chat_chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `chat_users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_reply_to_fkey` FOREIGN KEY (`reply_to`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_message_versions` ADD CONSTRAINT `chat_message_versions_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_attachments` ADD CONSTRAINT `chat_attachments_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `chat_attachment_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_message_attachments` ADD CONSTRAINT `chat_message_attachments_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_message_attachments` ADD CONSTRAINT `chat_message_attachments_attachment_id_fkey` FOREIGN KEY (`attachment_id`) REFERENCES `chat_attachments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_claims` ADD CONSTRAINT `chat_claims_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chat_chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_claims` ADD CONSTRAINT `chat_claims_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `chat_users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_claims` ADD CONSTRAINT `chat_claims_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `chat_users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_reactions` ADD CONSTRAINT `chat_reactions_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_reactions` ADD CONSTRAINT `chat_reactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `chat_users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
