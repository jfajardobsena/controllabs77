import 'dotenv/config';
import app from './src/app';
import { initializeDatabase } from './src/config/data-source';

const PORT = Number(process.env.PORT ?? 5000);

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ControlLabs corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ No fue posible conectar con PostgreSQL:', error);
    process.exit(1);
  });