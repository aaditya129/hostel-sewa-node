const Service = require('../models/Service');

// Create Service
exports.createService = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const service = new Service({ heading, description });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Get All Services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get Single Service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { heading, description },
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
