import type {
  RunInput,
  FunctionRunResult,
  Target,
  Customer,
  ProductVariant
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  const customer = input.cart.buyerIdentity?.customer as Customer;

  // Verificamos que el cliente exista y que sea su primer pedido
  if (!customer || !customer.hasAnyTag || customer.numberOfOrders !== 0) {
    return EMPTY_DISCOUNT;
  }

  // Mapeamos los productos del carrito
  const targets: Target[] = input.cart.lines.map(line => ({
    productVariant: { id: (line.merchandise as ProductVariant).id }
  }));

  // Si no hay productos, no aplicamos el descuento
  if (targets.length === 0) {
    return EMPTY_DISCOUNT;
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        targets,
        value: {
          percentage: { value: 5 },
        },
        message: "5% OFF FIRST ORDER",
      }
    ],
  };
}
