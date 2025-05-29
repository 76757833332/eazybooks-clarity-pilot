
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface QuotationItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface QuotationItemsSectionProps {
  items: QuotationItem[];
  setItems: React.Dispatch<React.SetStateAction<QuotationItem[]>>;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItemAmount: (index: number, quantity: number, price: number) => void;
  calculateTotal: () => number;
}

const QuotationItemsSection: React.FC<QuotationItemsSectionProps> = ({
  items,
  setItems,
  addItem,
  removeItem,
  updateItemAmount,
  calculateTotal
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Items</CardTitle>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 md:col-span-5">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  value={item.description}
                  onChange={(e) => setItems(prev => prev.map((item, i) => 
                    i === index ? { ...item, description: e.target.value } : item
                  ))}
                  placeholder="Item description"
                  required
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => {
                    const quantity = parseFloat(e.target.value) || 0;
                    updateItemAmount(index, quantity, item.price);
                  }}
                  required
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Label htmlFor={`price-${index}`}>Price</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    updateItemAmount(index, item.quantity, price);
                  }}
                  required
                />
              </div>
              <div className="col-span-10 md:col-span-2">
                <Label>Amount</Label>
                <Input
                  value={`$${item.amount.toFixed(2)}`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-lg font-semibold">
                Total: ${calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationItemsSection;
