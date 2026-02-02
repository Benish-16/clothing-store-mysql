DELIMITER $$
CREATE PROCEDURE store_otp(
    IN p_email VARCHAR(255),
    IN p_otp INT
)
BEGIN
INSERT INTO otp(email,otp)
VALUES(p_email,p_otp);
END $$
DELIMITER ;
