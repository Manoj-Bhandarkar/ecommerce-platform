from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime
from src.schemas.shipping_address import ShippingAddressOut
from src.schemas.shipping_status import ShippingStatusOut

class OrderedProductInfo(BaseModel):
  title: str
  description:str 
  model_config = {"from_attributes": True}
  

class OrderItemOut(BaseModel):
  id: int
  product_id: int | None
  quantity: int
  price: float
  product: OrderedProductInfo | None
  model_config = {"from_attributes": True}
   
  
class OrderOut(BaseModel):
  id: int
  user_id: UUID
  total_price: float
  status: str
  created_at: datetime
  shipping_address: ShippingAddressOut
  shipping_status: Optional[ShippingStatusOut] = None
  order_items: list[OrderItemOut]
  model_config = {"from_attributes": True}
  