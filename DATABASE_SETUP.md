# 🇳🇬 Recycly Nigeria - Database Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env` file with your database URL:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/recycly_nigeria"
```

### 2. Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with Nigerian data
pnpm db:seed

# Test database connection
pnpm db:setup

# Reset database (if needed)
pnpm db:reset
```

## 🇳🇬 Nigerian Data Included

### Waste Types (with realistic Naira rates)

- **Plastic Bottles**: ₦25/kg (PET bottles, water bottles)
- **Cardboard**: ₦15/kg (packaging materials)
- **Aluminum Cans**: ₦40/kg (beer cans, soft drink cans)
- **Glass Bottles**: ₦10/kg (beer bottles, wine bottles)
- **Organic Waste**: ₦5/kg (food scraps, garden waste)
- **Electronic Waste**: ₦100/kg (phones, computers)
- **Textiles**: ₦8/kg (old clothes, fabric)
- **Paper**: ₦12/kg (newspapers, magazines)

### System Settings

- **Currency**: NGN (Nigerian Naira)
- **Min Payout**: ₦500
- **Min Deposit**: 1kg
- **Max Daily Deposits**: 10 per user
- **Waste Manager Radius**: 5km

## Database Schema Features

✅ **Role-based Access**: SUPER_ADMIN, ADMIN, WASTE_MANAGER, USER  
✅ **Location Tracking**: Precise coordinates for Nigerian cities  
✅ **Photo Management**: Multiple photos per deposit  
✅ **Audit Trail**: Complete history of all changes  
✅ **Credit System**: Naira-based rewards  
✅ **Soft Deletes**: Data recovery support  
✅ **Performance**: Strategic indexes for scale

## Next Steps

1. Set up your PostgreSQL database
2. Run the setup commands above
3. Start the development server: `pnpm dev`
4. Test the API endpoints

## Troubleshooting

- **Connection Issues**: Check your DATABASE_URL
- **Schema Errors**: Run `pnpm db:generate` first
- **Data Issues**: Use `pnpm db:reset` to start fresh
