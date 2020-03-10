const mongoose = require("mongoose");
const Volume = mongoose.model("Volume");
const { validVolume } = require("../validation/index");
exports.currentVolume = (req, res, next) => {};

exports.addVolume = (req, res, next) => {
  const info = JSON.parse(req.userinfo);
  if (!(info.user.token.category == "admin")) {
    return res.status(200).json({
      message: `You can't authorize in this action`
    });
  }

  const volumeadd = ({ startDate, endDate, VolumeNo, subVolume } = req.body);
  const { valid, errors } = validVolume(volumeadd);

  if (!valid) {
    return res.status(400).json({ errors });
  }

  const volume = new Volume({ startDate, endDate, VolumeNo, subVolume });

  volume
    .save(response => {
      return res.status(200).json({
        message: {
          success: "Volume add successfully"
        }
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: {
          errors: err
        }
      });
    });
};
