const {
  registerUser,
  activeToken,
  login,
  getUserProfile,
} = require("../controllers/useController");
const { verifcationToken } = require("../middlewares/tokenVerifcation");

const router = require("express").Router();

router.post("/", registerUser);
router.get("/active/:activeToken", activeToken);
router.post("/login", login);
router.get("/profile", verifcationToken, getUserProfile);

module.exports = router;
