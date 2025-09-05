-- Insert sample procedures (will be associated with the first user who logs in)
-- Note: This is just sample data - in production, users will create their own procedures
INSERT INTO public.procedures (name, description, duration_minutes, price, category, requirements, contraindications, aftercare_instructions, user_id)
SELECT 
  'Limpieza Facial Profunda',
  'Limpieza facial completa con extracción de comedones y aplicación de mascarilla purificante',
  90,
  75.00,
  'Facial',
  'Piel sin heridas abiertas',
  'Embarazo, lactancia, tratamientos con retinoides',
  'Evitar exposición solar directa por 24 horas. Aplicar protector solar.',
  auth.uid()
WHERE auth.uid() IS NOT NULL

UNION ALL

SELECT 
  'Peeling Químico Superficial',
  'Exfoliación química suave para renovación celular y mejora de textura',
  60,
  120.00,
  'Peeling',
  'Consulta previa obligatoria',
  'Embarazo, lactancia, piel sensible extrema',
  'No exposición solar por 48 horas. Usar crema hidratante suave.',
  auth.uid()
WHERE auth.uid() IS NOT NULL

UNION ALL

SELECT 
  'Hidratación Facial',
  'Tratamiento hidratante intensivo con ácido hialurónico',
  75,
  85.00,
  'Facial',
  'Ninguno específico',
  'Alergia conocida a los componentes',
  'Mantener hidratación con productos recomendados.',
  auth.uid()
WHERE auth.uid() IS NOT NULL;
