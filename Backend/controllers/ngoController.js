// Mock data for NGOs
const ngosData = [
  { id: 1, name: 'Help Foundation', category: 'Education', description: 'Providing education to underprivileged children', email: 'contact@helpfoundation.org', phone: '1111111111', location: 'Mumbai', volunteers: 45 },
  { id: 2, name: 'Care Society', category: 'Healthcare', description: 'Healthcare services for rural areas', email: 'contact@caresociety.org', phone: '2222222222', location: 'Delhi', volunteers: 62 },
  { id: 3, name: 'Green Earth', category: 'Environment', description: 'Environmental conservation and sustainability', email: 'contact@greenearth.org', phone: '3333333333', location: 'Bangalore', volunteers: 38 }
];

// Get all NGOs
exports.getAllNGOs = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'NGOs retrieved successfully',
      data: ngosData,
      count: ngosData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving NGOs',
      error: error.message
    });
  }
};

// Get NGO by ID
exports.getNGOById = (req, res) => {
  try {
    const { id } = req.params;
    const ngo = ngosData.find(n => n.id === parseInt(id));
    
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'NGO retrieved successfully',
      data: ngo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving NGO',
      error: error.message
    });
  }
};

// Get NGOs by category
exports.getNGOsByCategory = (req, res) => {
  try {
    const { category } = req.params;
    const filteredNGOs = ngosData.filter(n => n.category.toLowerCase() === category.toLowerCase());
    
    if (filteredNGOs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No NGOs found for this category'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'NGOs retrieved successfully',
      data: filteredNGOs,
      count: filteredNGOs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving NGOs',
      error: error.message
    });
  }
};

// Create a new NGO (mock)
exports.createNGO = (req, res) => {
  try {
    const { name, category, description, email, phone, location, volunteers } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }
    
    const newNGO = {
      id: ngosData.length + 1,
      name,
      category,
      description: description || '',
      email: email || '',
      phone: phone || '',
      location: location || '',
      volunteers: volunteers || 0
    };
    
    ngosData.push(newNGO);
    
    res.status(201).json({
      success: true,
      message: 'NGO created successfully',
      data: newNGO
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating NGO',
      error: error.message
    });
  }
};

// Delete NGO (mock)
exports.deleteNGO = (req, res) => {
  try {
    const { id } = req.params;
    const index = ngosData.findIndex(n => n.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }
    
    const deletedNGO = ngosData.splice(index, 1);
    
    res.status(200).json({
      success: true,
      message: 'NGO deleted successfully',
      data: deletedNGO[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting NGO',
      error: error.message
    });
  }
};
