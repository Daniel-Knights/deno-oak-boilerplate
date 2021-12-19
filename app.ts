import { Application } from './config/deps.ts';

import './config/db.ts';
import router from './routes.ts';
import { log } from './functions/utils.ts';

const app = new Application();

// Middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Event listeners
app.addEventListener('error', (e) => console.error('Error: ', e.error));
app.addEventListener('listen', ({ hostname, port, secure }) => {
  log(
    `Listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`
  );
});

await app.listen({ port: 3000 });
