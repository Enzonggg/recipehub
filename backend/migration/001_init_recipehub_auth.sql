CREATE DATABASE IF NOT EXISTS recipehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recipehub;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer', 'staff') NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- Ensure existing databases from old schema can store admin role.
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'customer', 'staff') NOT NULL;

-- Default admin credential requested by project owner.
-- email: admin@gmail.com
-- password: admin1234
INSERT INTO users (full_name, email, password_hash, role)
VALUES ('System Admin', 'admin@gmail.com', '$2a$10$J4Aq2OyhUxH9BM5URWSMf.dCOKkNeYr.gWQE7JgGN8ZC8Tsz9/Qs.', 'admin')
ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS recipes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  summary TEXT,
  category VARCHAR(80) NOT NULL,
  course_type VARCHAR(80) NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  duration_minutes INT UNSIGNED NOT NULL,
  image_url TEXT,
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  submitted_by BIGINT UNSIGNED NOT NULL,
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_recipes_submitted_by FOREIGN KEY (submitted_by) REFERENCES users(id),
  CONSTRAINT fk_recipes_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_recipes_status (status),
  INDEX idx_recipes_submitted_by (submitted_by),
  INDEX idx_recipes_category (category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recipe_id BIGINT UNSIGNED NOT NULL,
  ingredient_text VARCHAR(255) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT fk_ingredients_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  INDEX idx_ingredients_recipe (recipe_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_steps (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recipe_id BIGINT UNSIGNED NOT NULL,
  step_text TEXT NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT fk_steps_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  INDEX idx_steps_recipe (recipe_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_favorites (
  recipe_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recipe_id, user_id),
  CONSTRAINT fk_favorites_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_favorites_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_likes (
  recipe_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recipe_id, user_id),
  CONSTRAINT fk_likes_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_likes_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_comments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recipe_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_comments_recipe (recipe_id),
  INDEX idx_comments_user (user_id)
) ENGINE=InnoDB;