import Threat from "../models/threat.model.js";
import Endpoint from "../models/endpoint.model.js";

// Controller to get all threats
export const getThreats = async (req, res) => {
  const { id, endpoint, status } = req.query;
  let wherePayload = {};

  if (id) {
    wherePayload = { ...wherePayload, _id: id };
  }
  if (endpoint) {
    wherePayload = { ...wherePayload, endpoint };
  }
  if (status) {
    wherePayload = { ...wherePayload, status };
  }

  try {
    const threats = await Threat.find(wherePayload);
    return res.status(200).json(threats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting threats", error });
  }
};

// Controller to create a new threat
export const createThreat = async (req, res) => {
  const threat = new Threat(req.body);

  try {
    const newThreat = await threat.save();
    res.status(201).json(newThreat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a threat
export const updateThreat = async (req, res) => {
  try {
    const updatedThreat = await Threat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedThreat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a threat
export const deleteThreat = async (req, res) => {
  try {
    const deletedThreat = await Threat.findByIdAndDelete(req.params.id);

    if (!deletedThreat) {
      return res.status(404).json({ message: "Threat not found" });
    }

    // remove threat from endpoint model from threats array
    await Endpoint.updateMany(
      { threats: req.params.id },
      { $pull: { threats: req.params.id } }
    );

    res.status(200).json({ message: "Threat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
