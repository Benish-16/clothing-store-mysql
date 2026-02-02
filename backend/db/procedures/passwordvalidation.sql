DELIMITER $$


CREATE PROCEDURE validate_password(IN p_password VARCHAR(255))
BEGIN
    IF LENGTH(p_password) < 6 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password too short';
    END IF;
    IF p_password NOT REGEXP '[A-Z]' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must contain uppercase';
    END IF;
    IF p_password NOT REGEXP '[0-9]' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must contain a digit';
    END IF;
    IF p_password NOT REGEXP '[^a-zA-Z0-9]' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must contain special char';
    END IF;
END$$
DELIMITER ;