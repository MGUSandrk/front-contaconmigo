# Product Payments Design

## Goal

Add controlled purchase payments to the product creation view. The user can split the purchase total across one or more payment types, and the frontend only submits when the payment total equals the total cost of all lots.

## API Contract

`POST /products/create` receives the existing product fields plus `payments`:

```json
{
  "name": "string",
  "salePrice": 0.1,
  "lots": [
    {
      "unitPrice": 0.1,
      "stock": 0
    }
  ],
  "payments": [
    {
      "id": "string",
      "amount": "string"
    }
  ]
}
```

## UI Behavior

The product form loads available payment types through `PaymentTypeServicio.listarTiposPago()`.

Below the lot table, the form shows a controlled payment selector: a payment type dropdown, an amount input, and an add button. Added payments appear in a table with the payment type label, amount, and a delete action.

The same payment type cannot be added twice. The user can remove it and add it again with a different amount.

## Validation

The purchase total is the sum of `unitPrice * stock` for every lot. The payment total is the sum of all payment amounts.

Saving is blocked when there are no payments, when a payment amount is zero or negative, or when the payment total does not exactly match the purchase total rounded to two decimals.

## Testing

Update the existing product creation test to mock payment types, add a payment, and assert that `ProductoServicio.crearProducto` receives `payments` with string `id` and `amount`.
