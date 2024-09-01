import User from "../models/user.model.js";

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // dont return password, createdAt, updatedAt
    const users = await User.find().select("-password -createdAt -updatedAt");
    res.json(users);
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
