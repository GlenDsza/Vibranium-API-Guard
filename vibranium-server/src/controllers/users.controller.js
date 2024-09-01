import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  const { userId, organization } = req.query;
  let wherePayload = {};
  console.log({ userId, organization });
  if (userId) {
    wherePayload = { ...wherePayload, userId };
  }
  if (organization) {
    wherePayload = { ...wherePayload, organization };
  }

  try {
    const users = await User.find(wherePayload).populate("organization");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSingleUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      userId: req.params.userId,
    });
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
