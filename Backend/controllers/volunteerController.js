// Mock data for volunteers
const volunteersData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', role: 'volunteer', organization: 'Help Foundation', skills: ['Teaching', 'Coding'], availability: ['Monday', 'Wednesday'] },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', role: 'volunteer', organization: 'Care Society', skills: ['Healthcare', 'Nursing'], availability: ['Tuesday', 'Thursday'] },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212', role: 'admin', organization: 'Green Earth', skills: ['Leadership', 'Planning'], availability: ['Everyday'] }
];

// Get all volunteers
exports.getAllVolunteers = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Volunteers retrieved successfully',
      data: volunteersData,
      count: volunteersData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving volunteers',
      error: error.message
    });
  }
};

// Get volunteer by ID
exports.getVolunteerById = (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = volunteersData.find(v => v.id === parseInt(id));
    
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Volunteer retrieved successfully',
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving volunteer',
      error: error.message
    });
  }
};

// Create a new volunteer (mock)
exports.createVolunteer = (req, res) => {
  try {
    const { name, email, phone, role, organization, skills, availability } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    const newVolunteer = {
      id: volunteersData.length + 1,
      name,
      email,
      phone: phone || '',
      role: role || 'volunteer',
      organization: organization || '',
      skills: skills || [],
      availability: availability || []
    };
    
    volunteersData.push(newVolunteer);
    
    res.status(201).json({
      success: true,
      message: 'Volunteer created successfully',
      data: newVolunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating volunteer',
      error: error.message
    });
  }
};

// Delete volunteer (mock)
exports.deleteVolunteer = (req, res) => {
  try {
    const { id } = req.params;
    const index = volunteersData.findIndex(v => v.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }
    
    const deletedVolunteer = volunteersData.splice(index, 1);
    
    res.status(200).json({
      success: true,
      message: 'Volunteer deleted successfully',
      data: deletedVolunteer[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting volunteer',
      error: error.message
    });
  }
};
