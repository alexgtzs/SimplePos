require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });

console.log('Variables de entorno cargadas:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);