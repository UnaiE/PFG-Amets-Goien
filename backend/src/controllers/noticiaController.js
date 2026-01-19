import Noticia from '../models/Noticia.js';

// Get all noticias
export const getNoticias = async (req, res) => {
  try {
    const noticias = await Noticia.getAll();
    res.json(noticias);
  } catch (error) {
    console.error('Error fetching noticias:', error);
    res.status(500).json({ message: 'Error al obtener noticias' });
  }
};

// Get noticia by ID
export const getNoticiaById = async (req, res) => {
  try { 
    const noticia = await Noticia.getById(req.params.id);
    if(!noticia){
        return res.status(404).json({message: 'Noticia no encontrada'});      
    }else{
        res.json(noticia);
    };
    } catch (error) {
    console.error('Error fetching noticia by ID:', error);
    res.status(500).json({ message: 'Error al obtener noticia por ID' });
  }
};

// Create new noticia
export const createNoticia = async (req, res) => {
  try {
    // Obtener el user ID del token JWT
    const userId = req.user?.id;
    
    const noticiaData = {
      ...req.body,
      creado_por: userId
    };
    
    const newNoticia = await Noticia.create(noticiaData);
    res.status(201).json(newNoticia);
    } catch (error) {
    console.error('Error creating noticia:', error);
    res.status(500).json({ message: 'Error al crear noticia' });
  }
};

// Update existing noticia
export const updateNoticia = async (req, res) => {
  try {
    const updatedNoticia = await Noticia.update(req.params.id, req.body);
    if(!updatedNoticia){
        return res.status(404).json({message: 'Noticia no encontrada'});      
    }
    res.json(updatedNoticia);
  } catch (error) {
    console.error('Error updating noticia:', error);
    res.status(500).json({ message: 'Error al actualizar noticia' });
  }
};

// Delete existing noticia
export const deleteNoticia = async (req, res) => {
  try { 
    const noticia = await Noticia.getById(req.params.id);   
    if(!noticia){
        return res.status(404).json({message: 'Noticia no encontrada'});      
    }
    await Noticia.delete(req.params.id);
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting noticia:', error);
    res.status(500).json({ message: 'Error al eliminar noticia' });
  }
};