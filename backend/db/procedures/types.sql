DELIMITER $$

CREATE PROCEDURE create_type (
    IN p_name VARCHAR(255),
    IN p_category ENUM('Men', 'Women', 'Child'),
    IN p_image VARCHAR(255)
)
BEGIN
    INSERT INTO types (name, category, image)
    VALUES (p_name, p_category, p_image);

    SELECT LAST_INSERT_ID() AS type_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE fetch_types_by_category(
    IN p_category ENUM('Men','Women','Child'),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN

    SELECT *
    FROM types
    WHERE category = p_category
    LIMIT p_limit OFFSET p_offset;

 
    SELECT COUNT(*) AS total
    FROM types
    WHERE category = p_category;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE update_type_image(IN p_id INT, IN p_image VARCHAR(255))
BEGIN
    UPDATE types
    SET image = p_image,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE delete_type(IN p_id INT)
BEGIN
    DELETE FROM types WHERE id = p_id;
END$$

DELIMITER ;


