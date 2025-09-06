# Weighted Average Net Price System

## How It Works

The system now calculates a **weighted average** of net prices instead of just using the latest price. This provides more accurate profit calculations by reflecting the true average cost of your inventory.

## Formula

**Weighted Average = (Existing Quantity × Existing Price + New Quantity × New Price) ÷ Total Quantity**

## Example Scenarios

### Scenario 1: Adding More of the Same Tyre
- **Initial stock**: 10 tyres at £20.00 net
- **Add**: 5 more tyres at £19.95 net
- **Calculation**: (10 × £20.00 + 5 × £19.95) ÷ 15 = (£200.00 + £99.75) ÷ 15 = £19.98
- **Result**: Net price becomes £19.98 (weighted average)

### Scenario 2: Adding Higher-Priced Stock
- **Initial stock**: 8 tyres at £18.50 net
- **Add**: 12 more tyres at £22.00 net
- **Calculation**: (8 × £18.50 + 12 × £22.00) ÷ 20 = (£148.00 + £264.00) ÷ 20 = £20.60
- **Result**: Net price becomes £20.60 (weighted average)

### Scenario 3: Adding Lower-Priced Stock
- **Initial stock**: 15 tyres at £25.00 net
- **Add**: 3 more tyres at £20.00 net
- **Calculation**: (15 × £25.00 + 3 × £20.00) ÷ 18 = (£375.00 + £60.00) ÷ 18 = £24.17
- **Result**: Net price becomes £24.17 (weighted average)

## Benefits

1. **More Accurate Profit Calculations**: Profit calculations now use the true average cost
2. **Better Inventory Valuation**: Stock value reflects actual average cost
3. **Fair Pricing**: Suggested fitting prices are based on realistic costs
4. **Business Intelligence**: Better understanding of true profit margins

## What Happens When You Edit

- **Editing quantity**: Only changes quantity, net price remains the same
- **Editing net price**: Only changes that specific item's net price (doesn't affect weighted average)
- **Adding new stock**: Automatically calculates new weighted average

## Profit Calculation

The profit formula remains the same but now uses the weighted average net price:
**Profit = (Fitting Price - Weighted Average Net Price × 1.2) × Quantity**
