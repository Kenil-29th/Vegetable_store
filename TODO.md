# TODO: Fix Admin Panel Blank Issue

## Steps to Complete
- [x] Update Backend/models/userModel.js to include 'admin' in role enum
- [x] Update Backend/routes/adminRoutes.js to authorize 'admin' role
- [x] Update Backend/routes/productRoutes.js to add protect middleware
- [x] Update Backend/controllers/productController.js to set supplier in product creation (for suppliers only)
