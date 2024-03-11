import esm from 'esm';

const requireWithEsm = esm(module);
const indexModule = requireWithEsm('./index.js');

export default indexModule;
