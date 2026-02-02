CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,

    status ENUM('open', 'replied', 'closed') DEFAULT 'open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE contact_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,

    message TEXT NOT NULL,
    replied_by VARCHAR(100) DEFAULT 'Admin',
    replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (contact_id)
        REFERENCES contacts(id)
        ON DELETE CASCADE
);
