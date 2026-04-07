import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1, 'Este campo es obligatorio').max(10, 'No puede tener más de 10 caracteres');
const optionalNonEmptyString = z
  .string()
  .trim()
  .max(50, 'No puede tener más de 50 caracteres')
  .optional()
  .transform((value) => {
    if (!value || value === '') return null;
    return value;
  });

export const ubicacionSchema = z.object({
  pasillo: nonEmptyString.min(3, 'debe tener al menos 3 caracteres'),
  estante: nonEmptyString.min(3, 'debe tener al menos 3 caracteres'),
  caja: nonEmptyString.min(3, 'debe tener al menos 3 caracteres'),
});

export const tipoComponenteSchema = z.object({
  nombre: nonEmptyString.min(3, 'El nombre debe tener al menos 3 caracteres'),
});

export const componenteSchema = z.object({
  tipo_id: z.preprocess(
    (value) => Number(value),
    z.number().int().positive('tipo_id debe ser un entero positivo')
  ),
  ubicacion_id: z.preprocess(
    (value) => Number(value),
    z.number().int().positive('ubicacion_id debe ser un entero positivo')
  ),
  marca_modelo: nonEmptyString.min(3, 'Marca/Modelo debe tener al menos 3 caracteres'),
  interfaz: optionalNonEmptyString,
  capacidad: optionalNonEmptyString,
  cantidad: z.preprocess(
    (value) => Number(value),
    z.number().int().nonnegative('cantidad debe ser cero o mayor')
  ),
});