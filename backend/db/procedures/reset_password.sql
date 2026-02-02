DELIMITER $$
CREATE PROCEDURE reset_password(
    IN p_email VARCHAR(255),
    IN p_otp INT,
    IN p_new_password VARCHAR(255)
)
BEGIN

    CALL verify_otp(p_email, p_otp);

  
    CALL validate_password(p_new_password );
    UPDATE users
    SET password = SHA2(p_new_password, 256)
    WHERE email = p_email;


    DELETE FROM otp WHERE email = p_email;
END$$

DELIMITER ;