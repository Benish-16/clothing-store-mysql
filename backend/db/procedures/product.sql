DELIMITER $$

CREATE PROCEDURE create_product (
  IN p_name VARCHAR(255),
  IN p_description TEXT,
  IN p_price DECIMAL(10,2),
  IN p_category ENUM('Men','women','Child'),
  IN p_type_id INT
)
BEGIN
  INSERT INTO products (name, description, price, category, type_id)
  VALUES (p_name, p_description, p_price, p_category, p_type_id);

  SELECT LAST_INSERT_ID() AS product_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE add_variant (
  IN p_product_id INT,
  IN p_color VARCHAR(100),
  IN p_images VARCHAR(255)
)
BEGIN
  DECLARE v_id INT;


  SELECT id
  INTO v_id
  FROM product_variants
  WHERE product_id = p_product_id
    AND LOWER(color) = LOWER(p_color)
  LIMIT 1;

  IF v_id IS NULL THEN

    INSERT INTO product_variants (product_id, color, images)
    VALUES (
      p_product_id,
      LOWER(p_color),
      p_images
    );

    SET v_id = LAST_INSERT_ID();

  END IF;


  SELECT v_id AS variant_id;

END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE add_size (
  IN p_variant_id INT,
  IN p_size VARCHAR(50),
  IN p_quantity INT
)
BEGIN
  DECLARE s_id INT;

  SELECT id
  INTO s_id
  FROM variant_sizes
  WHERE variant_id = p_variant_id
    AND LOWER(size) = LOWER(p_size)
  LIMIT 1;

  IF s_id IS NULL THEN

    INSERT INTO variant_sizes (variant_id, size, quantity)
    VALUES (
      p_variant_id,
      LOWER(p_size),
      p_quantity
    );

  END IF;

END$$

DELIMITER ;





DELIMITER $$

CREATE PROCEDURE get_filtered_products(
    IN p_category VARCHAR(20),
    IN p_type VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN

 
    SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.category,
        t.name AS type_name,
        v.id AS variant_id,
        v.color,
        v.images,
        s.id AS size_id,
        s.size,
        s.quantity
    FROM
    (
        SELECT p.id
        FROM products p
        LEFT JOIN types t ON p.type_id = t.id
        WHERE (p_category IS NULL OR p.category = p_category)
          AND (p_type IS NULL OR t.name = p_type)
        ORDER BY p.id
        LIMIT p_limit OFFSET p_offset
    ) paged
    JOIN products p ON p.id = paged.id
    LEFT JOIN types t ON p.type_id = t.id
    LEFT JOIN product_variants v ON p.id = v.product_id
    LEFT JOIN variant_sizes s ON v.id = s.variant_id
    ORDER BY p.id, v.id, s.id;


 
    SELECT COUNT(DISTINCT p.id) AS total
    FROM products p
    LEFT JOIN types t ON p.type_id = t.id
    WHERE (p_category IS NULL OR p.category = p_category)
      AND (p_type IS NULL OR t.name = p_type);

END$$

DELIMITER ;



DELIMITER $$

DROP PROCEDURE IF EXISTS get_product_by_id$$

CREATE PROCEDURE get_product_by_id(IN p_product_id INT)
BEGIN
    SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.category,
        t.name AS type_name,
        v.id AS variant_id,
        v.color,
        v.images,
        s.id AS size_id,
        s.size,
        s.quantity
    FROM products p
    LEFT JOIN types t ON p.type_id = t.id
    LEFT JOIN product_variants v ON p.id = v.product_id
    LEFT JOIN variant_sizes s ON v.id = s.variant_id
    WHERE p.id = p_product_id
    ORDER BY v.id, s.id;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE update_product_basic(
    IN p_id INT,
    IN p_name VARCHAR(100),
    IN p_description TEXT,
    IN p_price DECIMAL(10,2)
)
BEGIN
    UPDATE products
    SET
        name = p_name,
        description = p_description,
        price = p_price,
        
    WHERE id = p_id;
END$$

DELIMITER ;



