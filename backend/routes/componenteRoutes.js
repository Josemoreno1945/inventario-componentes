import express from 'express';
import { getComponentes, createComponente, updateCantidad, updateComponente, deleteComponente } from '../controllers/componenteController.js';
import { validateBody } from '../middlewares/validateSchema.js';
import { componenteSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.get('/', getComponentes);
router.post('/', validateBody(componenteSchema), createComponente);
router.put('/:id/cantidad', updateCantidad);
router.put('/:id', validateBody(componenteSchema), updateComponente);
router.delete('/:id', deleteComponente);

export default router;
