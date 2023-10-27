import { verifyToken } from "../controllers/user";

const protectApi = async (req, res, next) => {
  try {
    let authorization = req.header("Authorization");
    if (authorization) {
      // verify   JWT TOken here
      const token = authorization.split(" ")[1]; //Bearer abcd
      await verifyToken(token);
      return next();
    }

    res.status(403).json({ message: "Unauthorized access" });
  } catch (error) {
    res.status(403).json({ message: "Unauthorized access" });
  }
};

export default protectApi;
