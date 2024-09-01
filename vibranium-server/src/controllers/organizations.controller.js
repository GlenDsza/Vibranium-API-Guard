import Organization from "../models/organization.model.js";

// Controller to get all organizations or a specific one
export const getOrganizations = async (req, res) => {
  const { id } = req.query;
  let wherePayload = {};

  if (id) {
    wherePayload = { ...wherePayload, _id: id };
  }

  try {
    const organizations = await Organization.find(wherePayload);
    return res.status(200).json(organizations);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error getting organizations", error });
  }
};

// Controller to create a new organization
export const createOrganization = async (req, res) => {
  const organization = new Organization(req.body);

  try {
    const newOrganization = await organization.save();
    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to update an organization
export const updateOrganization = async (req, res) => {
  try {
    const { blockedIps } = req.body;

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      { blockedIps },
      { new: true }
    );

    res.status(200).json(updatedOrganization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete an organization
export const deleteOrganization = async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
