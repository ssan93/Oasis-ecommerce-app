"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/server/payload/payload-types";
import { Button, Input } from "@/app/_components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { ITEM_MAX_QUANTITY_SELECTOR } from "@/models/constants";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const handleChange = (value: string) => {
    setQuantity(+value);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleChange} defaultValue="1">
        <SelectTrigger>
          <SelectValue placeholder="Quantity" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: ITEM_MAX_QUANTITY_SELECTOR }, (_, i) => (
            <SelectItem key={i} value={(i + 1).toString()}>
              Quantity: {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          addItem(product, quantity);
          setIsSuccess(true);
        }}
        size="lg"
        className="w-full"
      >
        {isSuccess ? "Added!" : "Add to cart"}
      </Button>
    </div>
  );
};

export default AddToCartButton;
