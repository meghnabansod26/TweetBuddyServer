import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const indexModule = require('./index.js').default;

export default indexModule;

