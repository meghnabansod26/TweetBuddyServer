import esm from 'esm';

const requireWithEsm = esm(module);
const indexModule = await requireWithEsm('./index.js');

export default indexModule;
