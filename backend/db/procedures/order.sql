DELIMITER $$
CREATE PROCEDURE create_order(
    IN p_user_id INT,
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_address VARCHAR(255),
    IN p_apartment VARCHAR(100),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(100),
    IN p_pin VARCHAR(20),
    IN p_country VARCHAR(100),
    IN p_subtotal DECIMAL(10,2),
    IN p_shipping_cost DECIMAL(10,2),
    IN p_delivery_type VARCHAR(50),
    IN p_total DECIMAL(10,2),
    IN p_payment_method VARCHAR(50)
)
BEGIN
    INSERT INTO orders(
        user_id, first_name, last_name, email, phone, address, apartment, city, state, pin, country,
        subtotal, shipping_cost, delivery_type, total, payment_method
    ) VALUES(
        p_user_id, p_first_name, p_last_name, p_email, p_phone, p_address, p_apartment, p_city, p_state, p_pin, p_country,
        p_subtotal, p_shipping_cost, p_delivery_type, p_total, p_payment_method
    );

    SELECT LAST_INSERT_ID() AS order_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE add_order_item( IN p_order_id INT, IN p_product_id INT, IN p_name VARCHAR(255), IN p_variant_color VARCHAR(100), IN p_variant_image VARCHAR(255), IN p_size VARCHAR(50), IN p_quantity INT, IN p_price DECIMAL(10,2) ) BEGIN INSERT INTO order_items(order_id, product_id, name, variant_color, variant_image, size, quantity, price) VALUES(p_order_id, p_product_id, p_name, p_variant_color, p_variant_image, p_size, p_quantity, p_price); END;
DELIMITER ;
DELIMITER $$
DELIMITER $$

CREATE PROCEDURE verify_otp_order(
    IN p_email VARCHAR(255),
    IN p_otp INT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM order_otps
        WHERE email = p_email
          AND otp = p_otp
          AND created_at >= NOW() - INTERVAL 10 MINUTE
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid or expired OTP';
    END IF;
END$$

DELIMITER ;
DELIMITER $$
CREATE PROCEDURE store_otp_order(
    IN p_email VARCHAR(255),
    IN p_otp INT
)
BEGIN
INSERT INTO order_otps(email,otp)
VALUES(p_email,p_otp);
END $$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE get_all_orders(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN

    SELECT 
        o.id AS order_id,
        o.first_name,
        o.last_name,
        o.email,
        o.phone,
        o.total,
        o.order_status,
        oi.id AS item_id,
        oi.name AS item_name,
        oi.variant_color,
        oi.size,
        oi.quantity
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    ORDER BY o.id DESC
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS total
    FROM orders;

END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE update_order_status(
    IN p_order_id INT,
    IN p_status VARCHAR(50)
)
BEGIN
    UPDATE orders
    SET order_status = p_status
    WHERE id = p_order_id;
END$$

DELIMITER ;
