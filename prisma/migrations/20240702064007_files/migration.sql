/*
  Warnings:

  - You are about to drop the column `ext` on the `chat_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `chat_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `chat_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `chat_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `type_id` on the `chat_attachments` table. All the data in the column will be lost.
  - You are about to drop the `chat_attachment_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bucket` to the `chat_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `chat_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `chat_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `chat_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `chat_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chat_attachments` DROP FOREIGN KEY `chat_attachments_type_id_fkey`;

-- AlterTable
ALTER TABLE `chat_attachments` DROP COLUMN `ext`,
    DROP COLUMN `is_deleted`,
    DROP COLUMN `path`,
    DROP COLUMN `title`,
    DROP COLUMN `type_id`,
    ADD COLUMN `bucket` VARCHAR(128) NOT NULL,
    ADD COLUMN `fetched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `key` VARCHAR(128) NOT NULL,
    ADD COLUMN `name` VARCHAR(128) NOT NULL,
    ADD COLUMN `status` ENUM('active', 'blocked') NULL DEFAULT 'active',
    ADD COLUMN `type` VARCHAR(128) NOT NULL,
    ADD COLUMN `url` VARCHAR(128) NOT NULL;

-- DropTable
DROP TABLE `chat_attachment_types`;
