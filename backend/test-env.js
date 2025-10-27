const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('Current directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
