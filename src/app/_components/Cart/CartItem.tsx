import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatters";
import { getNestedField } from "@/lib/payload-utils";
import { Product } from "@/server/payload/payload-types";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemProps {
  product: Product;
  quantity: number;
}

const CartItem = ({ product, quantity }: CartItemProps) => {
  const { image } = product.images?.[0] ?? {};

  const { removeItem } = useCart();
  const { updateItem } = useCart();

  const category = getNestedField(product.category, "name");

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {typeof image !== "string" && image?.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="mb-1 line-clamp-1 text-sm font-medium">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {category}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="h-4 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 pr-2 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price * quantity)}
          </span>
          <QuantitySelector
            product={product}
            quantity={quantity}
            updateItem={updateItem}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
