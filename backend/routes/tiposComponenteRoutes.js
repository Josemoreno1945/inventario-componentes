import express from 'express';
import { 
  getTiposComponentes, 
  createTipoComponente, 
  getTipoComponenteById, 
  updateTipoComponente
} from '../controllers/tiposComponenteController.js';

import { validateBody } from '../middlewares/validateSchema.js';
import { tipoComponenteSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.get('/', getTiposComponentes);
router.get('/:id', getTipoComponenteById);
router.post('/', validateBody(tipoComponenteSchema), createTipoComponente);
router.put('/:id', validateBody(tipoComponenteSchema), updateTipoComponente);

export default router;

