import express from 'express';
import { getComponentes, createComponente } from '../controllers/componenteController.js';
import { validateBody } from '../middlewares/validateSchema.js';
import { componenteSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.get('/', getComponentes);
router.post('/', validateBody(componenteSchema), createComponente);

export default router;