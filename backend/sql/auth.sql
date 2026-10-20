USE myshop;

CREATE TABLE IF NOT EXISTS `user` (
  userId   INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(50)  NOT NULL UNIQUE,
  email    VARCHAR(50)  NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role     ENUM('admin','user') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS rating (
  ratingId INT AUTO_INCREMENT PRIMARY KEY,
  score    INT NOT NULL,
  userId   INT NOT NULL,
  menuId   INT NOT NULL,
  UNIQUE KEY uq_rating (userId, menuId),
  CONSTRAINT fk_rating_user FOREIGN KEY (userId) REFERENCES `user`(userId) ON DELETE CASCADE,
  CONSTRAINT fk_rating_menu FOREIGN KEY (menuId) REFERENCES menu(menuId) ON DELETE CASCADE
);
