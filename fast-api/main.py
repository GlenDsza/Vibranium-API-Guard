from fastapi import FastAPI, HTTPException, Query, Body
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Define the data model for the request body
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

# Mock database (in-memory)
fake_db = {}

# Create
@app.post("/items/", response_model=Item, responses={400: {"description": "Invalid item data"}})
async def create_item(item: Item):
    if item.price < 0:
        raise HTTPException(status_code=400, detail="Price must be a positive value")
    fake_db[item.name] = item
    return item

# Read
@app.get("/items/{item_name}", response_model=Item, responses={404: {"description": "Item not found"}})
async def read_item(item_name: str):
    item = fake_db.get(item_name)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Update
@app.put("/items/{item_name}", response_model=Item, responses={404: {"description": "Item not found"}, 400: {"description": "Invalid item data"}})
async def update_item(item_name: str, item: Item):
    if item_name not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.price < 0:
        raise HTTPException(status_code=400, detail="Price must be a positive value")
    fake_db[item_name] = item
    return item

# Delete
@app.delete("/items/{item_name}", responses={404: {"description": "Item not found"}})
async def delete_item(item_name: str):
    if item_name not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del fake_db[item_name]
    return {"detail": "Item deleted"}

# # Query parameters example
# @app.get("/items/")
# async def list_items(min_price: Optional[float] = Query(None, gt=0)):
#     filtered_items = [item for item in fake_db.values() if min_price is None or item.price >= min_price]
#     return filtered_items

# XSS Vulnerability Example
@app.get("/items/search/{query}")
async def search_items(query: str):
    # Unsafe rendering of user input, potential XSS vulnerability
    return {"result": f"<p>Search results for: {query}</p>"}


@app.get("/items/vulnerable_search/")
async def vulnerable_search(query: str):
    # Unsafe rendering of user input, potential XSS vulnerability
    return {"result": f"<div>Hello, {query}!</div>"}

@app.post("items/add-item")
async def add_item(id: str, name: str, description):
    return {"id": id, "name": name, "description": description}