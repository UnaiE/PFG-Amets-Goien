import Tarea from "../models/Tarea.js";


// Get all tareas
export const getAllTareas = async (req, res) => {
  try {
    const tareas = await Tarea.getAll();
    res.json(tareas);
  } catch (error) {
    console.error("Error fetching tareas:", error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};
// Get tarea by ID
export const getTareaById = async (req, res) => {
  try {
    const tarea = await Tarea.getById(req.params.id);   
    if (!tarea) {
      return res.status(404).json({ message: "Tarea not found" });
    }
    res.json(tarea);
  } catch (error) {
    console.error("Error fetching tarea by ID:", error);
    res.status(500).json({ message: "Error al obtener tarea por ID" });
  }
};
// Create new tarea
export const createTarea = async (req, res) => {
  try {
    // Obtener el user ID del token JWT (está disponible en req.user gracias al middleware auth)
    const userId = req.user?.id;
    
    const tareaData = {
      ...req.body,
      creado_por: userId,
      asignado_a: req.body.asignado_a || null
    };
    
    const newTarea = await Tarea.create(tareaData);
    res.status(201).json(newTarea);
  } catch (error) {
    console.error("Error creating tarea:", error);
    res.status(500).json({ message: "Error al crear tarea" });
  }
};

// Update existing tarea
export const updateTarea = async (req, res) => {
  try {
    const updatedTarea = await Tarea.update(req.params.id, req.body);
    if (!updatedTarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json(updatedTarea);
  } catch (error) {
    console.error("Error updating tarea:", error);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
};

// Delete existing tarea
export const deleteTarea = async (req, res) => {
  try {
    const tarea = await Tarea.getById(req.params.id);   
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    await Tarea.delete(req.params.id);
    res.json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting tarea:", error);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
};