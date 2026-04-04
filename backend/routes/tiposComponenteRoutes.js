import express from 'express';
import { getTiposComponentes, createTipoComponente } from '../controllers/tiposComponenteController.js';
import { validateBody } from '../middlewares/validateSchema.js';
import { tipoComponenteSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.get('/', getTiposComponentes);
router.post('/', validateBody(tipoComponenteSchema), createTipoComponente);

export default router;