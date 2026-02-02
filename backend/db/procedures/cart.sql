DELIMITER $$

CREATE PROCEDURE add_to_cart (
    IN p_user_id INT,
    IN p_product_id INT,
    IN p_name VARCHAR(255),
    IN p_variant_color VARCHAR(100),
    IN p_variant_image VARCHAR(255),
    IN p_size VARCHAR(50),
    IN p_quantity INT,
    IN p_price DECIMAL(10,2)
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_item_id INT;


    SELECT id INTO v_cart_id FROM carts WHERE user_id = p_user_id;
    IF v_cart_id IS NULL THEN
        INSERT INTO carts(user_id) VALUES(p_user_id);
        SET v_cart_id = LAST_INSERT_ID();
    END IF;


    SELECT id INTO v_item_id
    FROM cart_items
    WHERE cart_id = v_cart_id
      AND product_id = p_product_id
      AND LOWER(variant_color) = LOWER(p_variant_color)
      AND LOWER(size) = LOWER(p_size);

    IF v_item_id IS NOT NULL THEN
      
        UPDATE cart_items
        SET quantity = quantity + p_quantity 
        WHERE id = v_item_id and quantity>=1;
    ELSE
       
        INSERT INTO cart_items(cart_id, product_id, name, variant_color, variant_image, size, quantity, price)
        VALUES(v_cart_id, p_product_id, p_name, p_variant_color, p_variant_image, p_size, p_quantity, p_price);
    END IF;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE fetch_cart(IN p_user_id INT)
BEGIN
    DECLARE v_cart_id INT;

    SELECT id  INTO v_cart_id  FROM carts WHERE user_id = p_user_id;

        SELECT * FROM cart_items WHERE cart_id = v_cart_id;
 
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE remove_from_cart (
    IN p_user_id INT,
    IN p_product_id INT,
    IN p_variant_color VARCHAR(100),
    IN p_size VARCHAR(50)
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_item_id INT;

    SELECT id INTO v_cart_id FROM carts WHERE user_id = p_user_id;
  
    SELECT id INTO v_item_id
    FROM cart_items
    WHERE cart_id = v_cart_id
      AND product_id = p_product_id
      AND LOWER(variant_color) = LOWER(p_variant_color)
      AND LOWER(size) = LOWER(p_size);


    DELETE FROM cart_items WHERE id = v_item_id;
 
END$$

DELIMITER ;

