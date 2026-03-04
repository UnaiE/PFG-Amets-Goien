import Colaborador from '../models/Colaborador.js';


// Get all colaboradores
export const getColaboradores = async (req, res) => {
  try {
    const colaboradores = await Colaborador.getAll();
    res.json(colaboradores);    
    } catch (error) {
    console.error('Error fetching colaboradores:', error);
    res.status(500).json({ message: 'Error al obtener colaboradores' });
  }
};

// Get colaborador by ID
export const getColaboradorById = async (req, res) => {
  try { 
    const colaborador = await Colaborador.getById(req.params.id);
    if(!colaborador){
        return res.status(404).json({message: 'Colaborador no encontrado'});      
    }else{
        res.json(colaborador);
    };
    } catch (error) {
    console.error('Error fetching colaborador by ID:', error);
    res.status(500).json({ message: 'Error al obtener colaborador por ID' });
  }
};

// Create new colaborador
export const createColaborador = async (req, res) => {
  try {
    const newColaborador = await Colaborador.create(req.body);
    res.status(201).json(newColaborador);
    } catch (error) {
    console.error('Error creating colaborador:', error);
    res.status(500).json({ message: 'Error al crear colaborador' });
  }
};

// Update existing colaborador
export const updateColaborador = async (req, res) => {
  try {
    const updatedColaborador = await Colaborador.update(req.params.id, req.body);   
    if(!updatedColaborador){
        return res.status(404).json({message: 'Colaborador no encontrado'});      
    }
    res.json(updatedColaborador);
  } catch (error) {
    console.error('Error updating colaborador:', error);
    res.status(500).json({ message: 'Error al actualizar colaborador' });
  }
};

// Delete existing colaborador
export const deleteColaborador = async (req, res) => {
  try {
    const colaborador = await Colaborador.getById(req.params.id);   
    if(!colaborador){
        return res.status(404).json({message: 'Colaborador no encontrado'});      
    }
    await Colaborador.delete(req.params.id);
    res.json({ message: 'Colaborador eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting colaborador:', error);
    res.status(500).json({ message: 'Error al eliminar colaborador' });
  }
};

// Registro público de voluntarios (sin autenticación)
export const registerVoluntarioPublico = async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, direccion, mensaje } = req.body;

    // Comprobar si el email ya existe
    const colaboradores = await Colaborador.getAll();
    const exists = colaboradores.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      // Si ya es voluntario o ambos, ya está registrado
      if (exists.tipo_colaboracion === 'voluntario' || exists.tipo_colaboracion === 'ambos') {
        return res.status(409).json({ 
          message: 'Ya estás registrado como voluntario. Nos pondremos en contacto contigo pronto. ¡Gracias!' 
        });
      }
      
      // Si es solo donante, actualizarlo a 'ambos' y añadir datos de voluntario
      if (exists.tipo_colaboracion === 'donante') {
        const fechaActual = new Date().toISOString().split('T')[0];
        const nuevaAnotacion = exists.anotacion 
          ? `${exists.anotacion}\n[${fechaActual}] Se registró como voluntario: ${mensaje?.trim() || 'Sin mensaje adicional'}`
          : `[${fechaActual}] Se registró como voluntario: ${mensaje?.trim() || 'Sin mensaje adicional'}`;
        
        const colaboradorActualizado = await Colaborador.update(exists.id, {
          ...exists,
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          telefono: telefono?.trim() || exists.telefono || '',
          direccion: direccion?.trim() || exists.direccion || '',
          tipo_colaboracion: 'ambos',
          anotacion: nuevaAnotacion
        });
        
        console.log('✅ Donante actualizado a voluntario también:', colaboradorActualizado.email);
        
        return res.status(200).json({ 
          message: '¡Gracias por registrarte como voluntario! Ya nos habías apoyado con una donación. Nos pondremos en contacto contigo pronto.',
          colaborador: {
            id: colaboradorActualizado.id,
            nombre: colaboradorActualizado.nombre,
            apellidos: colaboradorActualizado.apellidos,
            email: colaboradorActualizado.email
          }
        });
      }
    }

    // Crear nuevo voluntario
    const nuevoVoluntario = await Colaborador.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono?.trim() || '',
      direccion: direccion?.trim() || '',
      anotacion: mensaje?.trim() || 'Registro voluntario desde formulario público web',
      tipo_colaboracion: 'voluntario',
      periodicidad: 'puntual'
    });

    console.log('✅ Nuevo voluntario registrado:', nuevoVoluntario.email);

    res.status(201).json({ 
      message: '¡Gracias por registrarte como voluntario! Nos pondremos en contacto contigo pronto.',
      colaborador: {
        id: nuevoVoluntario.id,
        nombre: nuevoVoluntario.nombre,
        apellidos: nuevoVoluntario.apellidos,
        email: nuevoVoluntario.email
      }
    });
  } catch (error) {
    console.error('❌ Error al registrar voluntario:', error);
    res.status(500).json({ 
      message: 'Error al procesar el registro. Por favor, inténtalo de nuevo más tarde.' 
    });
  }
};