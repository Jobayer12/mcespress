const mongoose = require("mongoose");
const Volume = mongoose.model("Volume");
const { validVolume } = require("../validation/index");

exports.runningVolume = async (req, res, next) => {
  Volume.findOne({ status: true })
    .then(response => {
      if (response.status === true) {
        req.volumeId = JSON.stringify(response);
      }

      return next();
    })
    .catch(err => {
      return res.status(400).json({
        message: {
          error: err
        }
      });
    });
};
exports.currentVolume = async (req, res) => {
  const { id } = req.params;

  Volume.findById({ _id: id })
    .then(async response => {
      if (response.status === true) {
        return res.status(200).json({
          message: {
            success: "Volume already current"
          }
        });
      }
      await Volume.findOneAndUpdate(
        { status: true },
        { $set: { status: false } },
        { upsert: true }
      );
      response.status = true;

      return await response.save();
    })
    .then(result => {
      return res.status(200).json({
        message: {
          success: result
        }
      });
    })

    .catch(err => {
      console.log(err);
      return res.status(400).json({
        errors: "volume not found"
      });
    });
};

exports.addVolume = (req, res, next) => {
  const info = JSON.parse(req.userinfo);
  const { start, end, volume, svolume } = req.body;
  const volumeadd = {
    start,
    end,
    volume,
    svolume
  };

  const { valid, errors } = validVolume(volumeadd);

  if (!valid) {
    return res.status(400).json({ errors });
  }

  let volumeadding = new Volume({
    start,
    end,
    volume,
    svolume,
    postedBy: info.user.token._id,
    status: false
  });

  volumeadding
    .save()
    .then(response => {
      return res.status(200).send({
        message: {
          success: response
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};
