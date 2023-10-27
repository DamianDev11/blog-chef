import User1 from "../models/user";
import jwt from "jsonwebtoken";

const sign = (obj) =>
  new Promise((resolve, reject) => {
    jwt.sign(obj, process.env.jwtPrivateKey, (error, token) => {
      if (error) return reject(error);

      return resolve(token);
    });
  });

const verify = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.jwtPrivateKey, (error) => {
      if (error) return reject();
      return resolve();
    });
  });

export const signUpAdmin = async ({ name, email, password }) => {
  try {
    await User1.create({ name, email, password, isAdmin: true });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const loginAdmin = async ({ email, password }) => {
  try {
    const user = await User1.findOne({ email, isAdmin: true });
    await user.checkPassword(password);
    await user.updateLoggedIn();
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const signUpUser = async ({ name, email, password }) => {
  try {
    const user = await User1.create({ name, email, password });
    //Generate JWT Token

    const token = await sign({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return Promise.resolve({
      user: { id: user._id, name: user.name, lastLoggedIn: user.lastLoggedIn },
      token,
    });
    
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const user = await User1.findOne({ email });
    await user.checkPassword(password);
    await user.updateLoggedIn();
    const token = await sign({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return Promise.resolve({
      user: { id: user._id, name: user.name, lastLoggedIn: user.lastLoggedIn },
      token,
    });
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const verifyToken = async (token) => {
  try {
    const user = jwt.decode(token);
    const findUser = await User1.findOne({ email: user.email });
    if (!findUser) {
      return Promise.reject({ error: "Unauthorized" });
    }

    //verify token and resolve
    await verify(token);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject({ error: "Unauthorized" });
  }
};

export const verifyUser = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User1.findOne({ email });
      return resolve(user ? true : false);
    } catch (error) {
      return reject(false);
    }
  });
