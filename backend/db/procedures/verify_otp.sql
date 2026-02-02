DELIMITER $$
CREATE PROCEDURE verify_otp(
    IN p_email VARCHAR (255),
    IN p_otp INT
)
BEGIN 
IF NOT EXISTS(SELECT * FROM otp where email=p_email   AND otp = p_otp
          AND created_at >= NOW() - INTERVAL 10 MINUTE)
          THEN  
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid or expired OTP';
END IF;
END $$
DELIMITER
