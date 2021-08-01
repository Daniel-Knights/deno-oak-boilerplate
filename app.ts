import { Application } from './config/deps.ts';

import router from './routes.ts';
import db from './config/db.ts';

const app = new Application();

// Initialise database
db.sync();

// Middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Event listeners
app.addEventListener('error', (e) => console.error('Error: ', e.error));
app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`
  );
});

await app.listen({ port: 3000 });
