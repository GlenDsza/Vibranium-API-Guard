from sqlalchemy.orm import Session
from main import User, Product, CartItem, Order, get_password_hash, engine

# Create a new session
db = Session(bind=engine)

# Dummy data for users
users_data = [
    {"username": "john_doe", "email": "john@example.com", "password": "password123"},
    {"username": "jane_smith", "email": "jane@example.com", "password": "password123"},
    {
        "username": "alice_brown",
        "email": "alice@example.com",
        "password": "password123",
    },
]

# Dummy data for products
products_data = [
    {
        "name": "Laptop",
        "description": "A high-performance laptop",
        "price": 1200.99,
        "stock": 10,
    },
    {
        "name": "Smartphone",
        "description": "A latest model smartphone",
        "price": 699.99,
        "stock": 25,
    },
    {
        "name": "Headphones",
        "description": "Noise-canceling headphones",
        "price": 199.99,
        "stock": 15,
    },
    {
        "name": "Smartwatch",
        "description": "A smartwatch with fitness tracking",
        "price": 249.99,
        "stock": 30,
    },
    {
        "name": "Tablet",
        "description": "A tablet with a large display",
        "price": 399.99,
        "stock": 20,
    },
]

# Dummy data for cart items (assuming products and users are added first)
cart_items_data = [
    {"user_id": 1, "product_id": 1, "quantity": 1},
    {"user_id": 1, "product_id": 2, "quantity": 2},
    {"user_id": 2, "product_id": 3, "quantity": 1},
]

# Dummy data for orders (assuming products and users are added first)
orders_data = [
    {
        "user_id": 1,
        "total_price": 1599.97,
        "address": "123 Main St",
        "status": "Shipped",
    },
    {"user_id": 2, "total_price": 199.99, "address": "456 Oak St", "status": "Pending"},
]

# Insert users into the database
for user_data in users_data:
    hashed_password = get_password_hash(user_data["password"])
    user = User(
        username=user_data["username"],
        email=user_data["email"],
        hashed_password=hashed_password,
    )
    db.add(user)

# Insert products into the database
for product_data in products_data:
    product = Product(**product_data)
    db.add(product)

# Commit the users and products to the database
db.commit()

# Insert cart items into the database
for cart_item_data in cart_items_data:
    cart_item = CartItem(**cart_item_data)
    db.add(cart_item)

# Insert orders into the database
for order_data in orders_data:
    order = Order(**order_data)
    db.add(order)

# Commit the cart items and orders to the database
db.commit()

print("Dummy data inserted successfully!")

# Close the session
db.close()
