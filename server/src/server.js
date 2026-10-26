import { readEnvironment } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';

try {
  const config = readEnvironment();
  await connectDatabase(config.mongoUri);
  const app = createApp(config);
  app.listen(config.port, () => console.log(`AI Mystery API listening on http://localhost:${config.port}`));
} catch (error) {
  console.error(`Unable to start AI Mystery: ${error.message}`);
  process.exit(1);
}
