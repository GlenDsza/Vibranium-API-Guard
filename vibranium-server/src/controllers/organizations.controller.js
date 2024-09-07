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

export const blockUnblockIp = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip, block } = req.body;
    if (!ip) {
      return res.status(400).json({ message: "IP is required" });
    }
    let organization;
    if (block === undefined || block === true) {
      organization = await Organization.findByIdAndUpdate(
        id,
        { $addToSet: { blockedIps: ip } }, // $addToSet prevents duplicates
        { new: true } // Return the updated document
      );
    } else {
      organization = await Organization.findByIdAndUpdate(
        id,
        { $pull: { blockedIps: ip } }, // $pull removes the specified value from an array
        { new: true } // Return the updated document
      );
    }

    if (!organization) {
      return res.status(400).json({ message: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error adding IP to blocked list", error });
  }
};

export const getBlockedIps = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(400).json({ message: "Organization not found" });
    }
    res.status(200).json(organization.blockedIps);
  } catch (error) {
    res.status(500).json({ message: "Error getting blocked IPs", error });
  }
};
