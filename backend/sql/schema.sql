CREATE DATABASE IF NOT EXISTS myshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myshop;

CREATE TABLE IF NOT EXISTS `type` (
  typeId INT AUTO_INCREMENT PRIMARY KEY,
  name   VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu (
  menuId       INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  isBestSeller TINYINT(1) NOT NULL DEFAULT 0,
  typeId       INT NOT NULL,
  CONSTRAINT fk_menu_type FOREIGN KEY (typeId) REFERENCES `type`(typeId)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `type` (name)
SELECT seed.name
FROM (
  SELECT 'อาหารจานเดียว' AS name
  UNION ALL SELECT 'เครื่องดื่ม'
  UNION ALL SELECT 'ของหวาน'
) AS seed
WHERE NOT EXISTS (
  SELECT 1
  FROM `type`
  WHERE `type`.name = seed.name
);

INSERT INTO menu (name, price, isBestSeller, typeId)
SELECT seed.name, seed.price, seed.isBestSeller, (
  SELECT MIN(typeId)
  FROM `type`
  WHERE `type`.name = seed.typeName
)
FROM (
  SELECT 'ข้าวผัดกระเพรา' AS name, 60.00 AS price, 1 AS isBestSeller, 'อาหารจานเดียว' AS typeName
  UNION ALL SELECT 'ผัดไทย', 70.00, 0, 'อาหารจานเดียว'
  UNION ALL SELECT 'ชาเย็น', 35.00, 1, 'เครื่องดื่ม'
  UNION ALL SELECT 'กาแฟเย็น', 40.00, 0, 'เครื่องดื่ม'
  UNION ALL SELECT 'บัวลอย', 45.00, 0, 'ของหวาน'
) AS seed
WHERE NOT EXISTS (
  SELECT 1
  FROM menu
  WHERE menu.name = seed.name
    AND menu.typeId = (
      SELECT MIN(typeId)
      FROM `type`
      WHERE `type`.name = seed.typeName
    )
);
