DELIMITER $$

CREATE PROCEDURE AddSubscription(IN new_email VARCHAR(255))
BEGIN
    DECLARE existing INT;

    SELECT COUNT(*) INTO existing 
    FROM Subscription 
    WHERE email = new_email;

    IF existing > 0 THEN
     
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Email already subscribed';
    ELSE
     
        INSERT INTO Subscription (email) VALUES (new_email);
    END IF;
END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE GetAllSubscribers()
BEGIN
    SELECT email FROM Subscription;
END $$

DELIMITER ;

