from fastapi import FastAPI, HTTPException, Path, Body
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="E-Commerce API",
    description="This is an API for an eCommerce platform.",
    version="1.0.0",
    servers=[
        {"url": "https://api.yourdomain.com/v1", "description": "Production server"}
    ],
)


# Models
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class Product(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    price: float
    stock: int


class CartItem(BaseModel):
    productId: str
    quantity: int


class Order(BaseModel):
    id: str
    items: List[CartItem]
    totalPrice: float
    address: str
    status: str


# Dummy data
dummy_products = [
    {
        "id": "1",
        "name": "Product 1",
        "description": "Description 1",
        "price": 10.0,
        "stock": 100,
    },
    {
        "id": "2",
        "name": "Product 2",
        "description": "Description 2",
        "price": 20.0,
        "stock": 50,
    },
]

dummy_orders = [
    {
        "id": "1",
        "items": [{"productId": "1", "quantity": 2}],
        "totalPrice": 20.0,
        "address": "123 Street, City",
        "status": "Pending",
    },
    {
        "id": "2",
        "items": [{"productId": "2", "quantity": 1}],
        "totalPrice": 20.0,
        "address": "456 Avenue, City",
        "status": "Shipped",
    },
]


# Endpoints
@app.post(
    "/auth/signup", response_description="User registered successfully", status_code=201
)
async def signup(request: SignupRequest):
    return {"message": "User registered successfully"}


@app.post("/auth/login", response_description="Login successful", status_code=200)
async def login(request: LoginRequest):
    return {"message": "Login successful"}


@app.get(
    "/products", response_model=List[Product], response_description="List of products"
)
async def get_products():
    return dummy_products


@app.post(
    "/products",
    response_model=Product,
    response_description="Product added successfully",
    status_code=201,
)
async def add_product(product: Product):
    return product


@app.get(
    "/products/{productId}",
    response_model=Product,
    response_description="Product details",
)
async def get_product(productId: str = Path(...)):
    for product in dummy_products:
        if product["id"] == productId:
            return product
    raise HTTPException(status_code=404, detail="Product not found")


@app.put(
    "/products/{productId}",
    response_model=Product,
    response_description="Product updated successfully",
)
async def update_product(productId: str = Path(...), product: Product = Body(...)):
    for idx, prod in enumerate(dummy_products):
        if prod["id"] == productId:
            dummy_products[idx] = product.dict()
            return product
    raise HTTPException(status_code=404, detail="Product not found")


@app.delete(
    "/products/{productId}",
    response_description="Product deleted successfully",
    status_code=200,
)
async def delete_product(productId: str = Path(...)):
    for product in dummy_products:
        if product["id"] == productId:
            dummy_products.remove(product)
            return {"message": "Product deleted successfully"}
    raise HTTPException(status_code=404, detail="Product not found")


@app.get("/cart", response_description="Cart details")
async def get_cart():
    return {
        "items": [{"productId": "1", "quantity": 2}],
        "totalPrice": 20.0,
    }


@app.post("/cart", response_description="Item added to cart", status_code=201)
async def add_to_cart(item: CartItem):
    return {"message": "Item added to cart"}


@app.get("/orders", response_model=List[Order], response_description="List of orders")
async def get_orders():
    return dummy_orders


@app.post(
    "/orders",
    response_model=Order,
    response_description="Order placed successfully",
    status_code=201,
)
async def place_order(order: Order):
    return order


@app.get(
    "/orders/{orderId}", response_model=Order, response_description="Order details"
)
async def get_order(orderId: str = Path(...)):
    for order in dummy_orders:
        if order["id"] == orderId:
            return order
    raise HTTPException(status_code=404, detail="Order not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
