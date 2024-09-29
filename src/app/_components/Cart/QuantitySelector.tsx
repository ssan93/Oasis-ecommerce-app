"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
  Input,
  Button,
} from "@/app/_components/ui";
import { ITEM_MAX_QUANTITY_SELECTOR } from "@/models/constants";
import { Product } from "@/server/payload/payload-types";
import { useState } from "react";

type QuantitySelectorProps = {
  quantity: number;
  updateItem: (id: string, quantity: number) => void;
  product: Product;
};

export const QuantitySelector = ({
  quantity,
  updateItem,
  product,
}: QuantitySelectorProps) => {
  const [newQuantity, setNewQuantity] = useState<number>(quantity);
  const [isFocused, setIsFocused] = useState(false);
  const [isInput, setIsInput] = useState(
    quantity >= ITEM_MAX_QUANTITY_SELECTOR,
  );

  const handleSelectChange = (value: string) => {
    if (+value >= ITEM_MAX_QUANTITY_SELECTOR) {
      setIsInput(true);
      setIsFocused(true);
    }
    setNewQuantity(+value);
    updateItem(product.id, +value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuantity(+e.target.value);
  };

  return (
    <>
      {!isInput ? (
        <Select
          onValueChange={handleSelectChange}
          defaultValue={quantity.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Quantity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="0" value="0">
              0 (Delete)
            </SelectItem>
            {Array.from({ length: ITEM_MAX_QUANTITY_SELECTOR - 1 }, (_, i) => (
              <SelectItem key={i + 1} value={i + 1 + ""}>
                {i + 1}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem
              key={ITEM_MAX_QUANTITY_SELECTOR}
              value={ITEM_MAX_QUANTITY_SELECTOR + ""}
            >
              {ITEM_MAX_QUANTITY_SELECTOR}+
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={newQuantity}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            min={0}
            className="w-16"
          />
          {isFocused && (
            <Button
              onClick={() => updateItem(product.id, newQuantity)}
              variant="secondary"
            >
              {newQuantity === 0 ? "Remove" : "Update"}
            </Button>
          )}
        </div>
      )}
    </>
  );
};
