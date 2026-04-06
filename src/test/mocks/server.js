/**
 * src/test/mocks/server.js
 * Configura o servidor MSW para o ambiente Node (Vitest usa Node, não browser).
 *
 * MSW v2: usa setupServer de 'msw/node' para interceptar fetch em Node.js
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Cria o servidor com os handlers padrão
// Handlers adicionais podem ser passados por teste via server.use(...)
export const server = setupServer(...handlers);
