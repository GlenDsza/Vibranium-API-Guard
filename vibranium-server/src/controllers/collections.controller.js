import Collection from "../models/collection.model.js";

// Controller to get all collections with where filter options
export const getCollections = async (req, res) => {
  const { id, name, organization, endpointId } = req.query;
  let wherePayload = {};

  if (id) {
    wherePayload = { ...wherePayload, _id: id };
  }
  if (name) {
    wherePayload = { ...wherePayload, name: { $regex: name, $options: "i" } };
  }
  if (organization) {
    wherePayload = { ...wherePayload, organization };
  }
  if (endpointId) {
    wherePayload = { ...wherePayload, endpoints: endpointId };
  }

  try {
    const collections = await Collection.find(wherePayload).populate(
      "endpoints"
    );
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to create a new collection
export const createCollection = async (req, res) => {
  const collection = new Collection(req.body);

  try {
    const newCollection = await collection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a collection
export const updateCollection = async (req, res) => {
  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a collection
export const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
