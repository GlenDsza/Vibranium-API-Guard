from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import sqlite3

app = FastAPI()

# Define the Pydantic model
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

# Utility function to get a database connection
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Create the items table
def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                tax REAL
            )
        ''')
        conn.commit()

# Initialize the database
init_db()

# Create
@app.post("/items/")
def create_item(item: Item):
    if item.price < 0:
        raise HTTPException(status_code=400, detail="Price must be a positive value")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO items (name, description, price, tax)
            VALUES (?, ?, ?, ?)
        ''', (item.name, item.description, item.price, item.tax))
        conn.commit()
    return item

# Read
@app.get("/items/{item_name}")
def read_item(item_name: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM items WHERE name = ?
        ''', (item_name,))
        item = cursor.fetchone()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return dict(item)

# Update
@app.put("/items/{item_name}")
def update_item(item_name: str, item: Item):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE items SET name = ?, description = ?, price = ?, tax = ?
            WHERE name = ?
        ''', (item.name, item.description, item.price, item.tax, item_name))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        conn.commit()
    return item

# Delete
@app.delete("/items/")
def delete_item(item_name: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM items WHERE name = ?
        ''', (item_name,))
        print(item_name)
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        conn.commit()
    return {"detail": "Item deleted"}

# Query parameters example
@app.get("/items/")
def list_items(min_price: Optional[float] = Query(None, gt=0)):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        if min_price is None:
            cursor.execute('''
                SELECT * FROM items
            ''')
        else:
            cursor.execute('''
                SELECT * FROM items WHERE price >= ?
            ''', (min_price,))
        items = cursor.fetchall()
    return [dict(item) for item in items]
