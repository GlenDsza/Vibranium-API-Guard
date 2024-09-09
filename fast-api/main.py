from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, constr
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./ecommerce.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT setup
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Define SQLAlchemy models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    cart_items = relationship("CartItem", back_populates="user")
    orders = relationship("Order", back_populates="user")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    price = Column(Float)
    stock = Column(Integer)


class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer)
    user = relationship("User", back_populates="cart_items")


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_price = Column(Float)
    address = Column(String)
    status = Column(String, default="Pending")
    user = relationship("User", back_populates="orders")


# Create all tables
Base.metadata.create_all(bind=engine)


# Utility functions for database interaction
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# JWT and password handling functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def set_headers(response: Response):
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "no-referrer-when-downgrade"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"


# FastAPI models
class SignupRequest(BaseModel):
    username: constr(max_length=50)  # type: ignore
    email: constr(max_length=50)  # type: ignore
    password: constr(max_length=50)  # type: ignore


class ProductCreate(BaseModel):
    name: constr(max_length=50)  # type: ignore
    description: Optional[constr(max_length=50)]  # type: ignore
    price: float
    stock: int


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    address: str


class OrderSend(BaseModel):
    id: int
    address: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    hashed_password: str


# FastAPI app
app = FastAPI()


# Authentication Endpoints
@app.post(
    "/auth/signup", 
    response_description="User registered successfully", 
    description="This is register API",
    status_code=201
)
async def signup(request: SignupRequest, db=Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(request.password)
    new_user = User(
        username=request.username, email=request.email, hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Product Endpoints
@app.post("/products", response_model=ProductCreate)
async def create_product(
    response: Response, product: ProductCreate, db=Depends(get_db)
):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    set_headers(response)
    return new_product


@app.get("/products", response_model=List[ProductCreate])
async def get_products(response: Response, db=Depends(get_db)):
    set_headers(response)
    return db.query(Product).all()


@app.get("/products/{product_id}", response_model=ProductCreate)
async def get_product(response: Response, product_id: int, db=Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    set_headers(response)
    return product


# Cart Endpoints
@app.get("/cart/{uid}", response_model=List[CartItemCreate])
async def get_cart(uid: int, response: Response, db=Depends(get_db)):
    set_headers(response)
    return db.query(CartItem).filter(CartItem.user_id == uid).all()


@app.post("/cart", response_description="Item added to cart", status_code=201)
async def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    new_item = CartItem(user_id=current_user.id, **item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"message": "Item added to cart"}


# Order Endpoints
@app.get("/orders", response_model=List[OrderSend])
async def get_orders(
    current_user: User = Depends(get_current_user), db=Depends(get_db)
):
    return db.query(Order).filter(Order.user_id == current_user.id).all()


@app.post(
    "/orders",
    response_model=OrderCreate,
    response_description="Order placed successfully",
)
async def place_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    total_price = sum(
        item.quantity
        * db.query(Product).filter(Product.id == item.product_id).first().price
        for item in db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    )
    new_order = Order(user_id=current_user.id, total_price=total_price, **order.dict())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@app.get("/users/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Fetch the authenticated user's details.
    """
    return current_user


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
