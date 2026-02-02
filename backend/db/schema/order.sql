CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    apartment VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    pin VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    subtotal DECIMAL(10,2),
    shipping_cost DECIMAL(10,2),
    delivery_type VARCHAR(50),
    total DECIMAL(10,2),
    payment_method VARCHAR(50) DEFAULT 'Card',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    order_status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL

);
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT ,
    product_id INT,
    name VARCHAR(255) NOT NULL,
    variant_color VARCHAR(100) NOT NULL,
    variant_image VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL

    
);
CREATE TABLE order_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    otp INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
