
Create Table products(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category ENUM('Men', 'women', 'Child') NOT NULL,
  type_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE CASCADE

);
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  color VARCHAR(100) NOT NULL,
  images VARCHAR(255) NOT NULL,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE TABLE variant_sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variant_id INT NOT NULL,
  size VARCHAR(50) NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0),

  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

