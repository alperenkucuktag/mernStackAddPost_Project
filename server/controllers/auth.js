const AuthSchema = require("../models/auth.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!isEmail(email)) {
      return res.status(500).json({
        msg: "Lütfen email adresinizi belirtilen kurallara göre giriniz",
      });
    }

    const user = await AuthSchema.findOne({ email });

    if (user) {
      return res
        .status(500)
        .json({ msg: "Mevcut kullanıcı üzerinden işlem yapılamaz" });
    }
    if (password.length < 6) {
      return res.status(500).json({ msg: "Lütfen 6 haneli şifre giriniz " });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await AuthSchema.create({
      username,
      email,
      password: passwordHash,
    });

    const token = jwt.sign({ id: newUser._id }, "SECRET_KEY", {
      expiresIn: "1h",
    });
    res.status(201).json({
      status: "OK",
      newUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthSchema.findOne({ email });

    if (!user) {
      return res.status(500).json({ msg: "Kullanıcı bulunamadı" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(500).json({ msg: "Girdiğiniz şifre yanlıştır" });
    }

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
      expiresIn: "1h",
    });
    res.status(200).json({
      status: "OK",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

function isEmail(emailAdress) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailAdress.match(regex)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  register,
  login,
};
