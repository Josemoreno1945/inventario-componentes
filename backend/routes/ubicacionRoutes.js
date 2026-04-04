import express from 'express';
import { getUbicaciones, createUbicacion } from '../controllers/ubicacionController.js';
import { validateBody } from '../middlewares/validateSchema.js';
import { ubicacionSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.get('/', getUbicaciones);
router.post('/', validateBody(ubicacionSchema), createUbicacion);

export default router;