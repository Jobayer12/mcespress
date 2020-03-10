const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const { ObjectId } = mongoose.Schema;
let SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email is required"
    },
    password: {
      type: String,
      trim: true,
      required: "Password is required"
    },
    category: {
      type: String,
      enum:["author","reviewer","admin"],
      default:"author",
    },
    isVerified: {
      type: Boolean
    },
    VerifiedCode: {
      type: String,
      trim: true
    }
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true }
);

const autoPopulateFollowingAndFollowers = function(next) {
  next();
};

userSchema.pre("findOne", autoPopulateFollowingAndFollowers);


userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return await bcrypt.compare(data, this.password);
};


module.exports = mongoose.model("User", userSchema);
