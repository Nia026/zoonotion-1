-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_verified` BOOLEAN NULL DEFAULT false,
    `otp_code` VARCHAR(10) NULL,

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_artikel` VARCHAR(255) NOT NULL,
    `isi_artikel` LONGTEXT NULL,
    `gambar_artikel` VARCHAR(255) NULL,
    `nama_author` VARCHAR(255) NOT NULL,
    `publish_date` DATE NULL DEFAULT (curdate()),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `communities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `banner_komunitas` VARCHAR(255) NULL,
    `nama_komunitas` VARCHAR(255) NOT NULL,
    `nama_penyelenggara` VARCHAR(255) NULL,
    `tahun_penyelenggara` YEAR NULL,
    `deskripsi_komunitas` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nama_komunitas`(`nama_komunitas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_hewan` VARCHAR(255) NOT NULL,
    `deskripsi_hewan` TEXT NULL,
    `kategori_hewan` ENUM('Aves', 'Mamalia', 'Pisces', 'Amfibi', 'Reptil') NOT NULL,
    `gambar_hewan` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `galleries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `community_id` INTEGER NOT NULL,
    `gambar_galeri` VARCHAR(255) NULL,
    `deskripsi_gambar` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `community_id`(`community_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `otp_code` VARCHAR(10) NULL,
    `is_verified` BOOLEAN NULL DEFAULT false,
    `role` VARCHAR(20) NULL DEFAULT 'user',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zoos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kebun_binatang` VARCHAR(255) NOT NULL,
    `deskripsi_kebun_binatang` TEXT NULL,
    `link_web_resmi` VARCHAR(255) NULL,
    `link_tiket` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `gambar_zoo` VARCHAR(255) NULL,

    UNIQUE INDEX `nama_kebun_binatang`(`nama_kebun_binatang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `username` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `foto_profil` VARCHAR(255) NULL,
    `tanggal_lahir` DATE NULL,
    `alamat` TEXT NULL,
    `noted` TEXT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `user_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `galleries` ADD CONSTRAINT `galleries_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
