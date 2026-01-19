import Actividad from '../models/Actividad.js';

// Get all actividades
export const getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.getAll();
    res.json(actividades);    
    } catch (error) {
    console.error('Error fetching actividades:', error);
    res.status(500).json({ message: 'Error al obtener actividades' });
  }
};

// Get actividad by ID
export const getActividadById = async (req, res) => {
  try {
    const actividad = await Actividad.getById(req.params.id);
    if(!actividad){
        return res.status(404).json({message: 'Actividad no encontrada'});      
    }else{
        res.json(actividad);
    };
    } catch (error) {
    console.error('Error fetching actividad by ID:', error);
    res.status(500).json({ message: 'Error al obtener actividad por ID' });
  }
};

// Create new actividad
export const createActividad = async (req, res) => {
  try {
    // Obtener el user ID del token JWT
    const userId = req.user?.id;
    
    const actividadData = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      fecha: req.body.fecha || null,
      creador_id: userId
    };
    
    const newActividad = await Actividad.create(actividadData);
    res.status(201).json(newActividad);
    } catch (error) {
    console.error('Error creating actividad:', error);
    res.status(500).json({ message: 'Error al crear actividad' });
  }
};

// Update existing actividad
export const updateActividad = async (req, res) => {
  try {
    const updatedActividad = await Actividad.update(req.params.id, req.body);   
    if(!updatedActividad){
        return res.status(404).json({message: 'Actividad no encontrada'});      
    }
    res.json(updatedActividad);
  } catch (error) {
    console.error('Error updating actividad:', error);
    res.status(500).json({ message: 'Error al actualizar actividad' });
  }
};

// Delete existing actividad
export const deleteActividad = async (req, res) => {
  try {
    const actividad = await Actividad.getById(req.params.id);   
    if(!actividad){
        return res.status(404).json({message: 'Actividad no encontrada'});      
    }
    await Actividad.delete(req.params.id);
    res.json({ message: 'Actividad eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting actividad:', error);
    res.status(500).json({ message: 'Error al eliminar actividad' });
  }
};