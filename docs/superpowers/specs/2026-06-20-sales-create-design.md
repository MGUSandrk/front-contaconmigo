# Sales Create Design

## Goal

Add a sale creation view that lets the user select a client, add one or more products with quantities, split the sale total across one or more payment types, and submit the API payload to `/sales/create`.

## API Contract

`POST /sales/create` receives:

```json
{
  "idClient": 0,
  "products": [
    {
      "idProduct": 0,
      "quantity": 0
    }
  ],
  "payments": [
    {
      "id": 0,
      "amount": 0.1
    }
  ]
}
```

`payments[].id` is the selected payment type id. Internally the UI should name this value `typePaymentId` and transform it to `id` only when building the API payload.

## UI Behavior

The view loads clients, products, and payment types on mount.

The client selector has a name search input and a select filtered by that search.

The product section has a product name search input, a filtered select, a quantity input, and an add button. Added products appear in a table with sale price, editable quantity, subtotal, and delete action.

The payment section follows the controlled payment pattern from product purchase: payment type select, amount input, add button, payment table, and total sale / total payments / pending summary.

## Validation

The sale total is the sum of `product.salePrice * quantity`. Saving is blocked unless a client is selected, at least one product exists, all product quantities are greater than zero, at least one payment exists, and pending is exactly zero after rounding to two decimals.
