-- AlterTable
ALTER TABLE `admins` MODIFY `role` ENUM('SUPERADMIN', 'ADMIN', 'MODERATOR', 'USER') NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `ROLE` ENUM('SUPERADMIN', 'ADMIN', 'MODERATOR', 'USER') NOT NULL DEFAULT 'USER';