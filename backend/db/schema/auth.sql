DELIMITER $$


CREATE PROCEDURE create_user(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_is_admin BOOLEAN
)
BEGIN
    CALL validate_password(p_password);

    INSERT INTO users (name, email, password, is_admin)
    VALUES (p_name, p_email, SHA2(p_password, 256), COALESCE(p_is_admin, FALSE));
END$$

DELIMITER ;