DELIMITER $$

CREATE PROCEDURE add_contact(
    IN p_fullname VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(20),
    IN p_message TEXT
)
BEGIN
    INSERT INTO contacts (fullname, email, phone, message)
    VALUES (p_fullname, p_email, p_phone, p_message);
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE get_all_contacts(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT *
    FROM contacts
    ORDER BY created_at DESC
    LIMIT p_limit OFFSET p_offset;
        SELECT COUNT(*) AS total
    FROM contacts;
END$$
DELIMITER ;
DELIMITER $$

CREATE PROCEDURE reply_to_contact(
    IN p_contact_id INT,
    IN p_reply TEXT
)
BEGIN
    INSERT INTO contact_replies (contact_id, message)
    VALUES (p_contact_id, p_reply);

    UPDATE contacts
    SET status = 'replied'
    WHERE id = p_contact_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE get_contact_with_replies(
    IN p_contact_id INT
)
BEGIN
    SELECT 
        c.id,
        c.fullname,
        c.email,
        c.phone,
        c.message,
        c.status,
        c.created_at,
        r.id AS reply_id,
        r.message AS reply_message,
        r.replied_by,
        r.replied_at
    FROM contacts c
    LEFT JOIN contact_replies r
        ON c.id = r.contact_id
    WHERE c.id = p_contact_id;
END$$

DELIMITER ;
