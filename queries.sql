CREATE TABLE books (
    isbn VARCHAR,
    title VARCHAR NOT NULL,
    authors VARCHAR NOT NULL,
    publish_date VARCHAR,
    cover_image TEXT,
	catefory VARCHAR
);

SELECT * FROM BOOKS;

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    pros TEXT,
    cons TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select* from reviews;

