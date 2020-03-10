const isEmail = email => {
  let reqEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (email.match(reqEx)) return true;
  else return false;
};

const isEmpty = string => {
  if (string === "") return true;
  else return false;
};

const vaidationSignUp = newuser => {
  let errors = {};
  if (isEmpty(newuser.email)) {
    errors.email = "email can not be empty";
  } else if (!isEmail(newuser.email)) {
    errors.email = "Must be a valid email address";
  }

  if (newuser.password.length <= 5)
    errors.password = "Password atleast 6 character";
  if (isEmpty(newuser.password)) errors.password = "password can not be empty";

  if (isEmpty(newuser.confirmPassword))
    errors.confirmPassword = "confirm password can not be empty";
  if (newuser.password !== newuser.confirmPassword)
    errors.confirmPassword = "password not match";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const vaidationSignIn = newuser => {
  let errors = {};
  if (isEmpty(newuser.email)) {
    errors.email = "email can not be empty";
  } else if (!isEmail(newuser.email)) {
    errors.email = "Must be a valid email address";
  }

  if (newuser.password.length <= 6)
    errors.password = "Password atleast 6 character";
  if (isEmpty(newuser.password)) errors.password = "password can not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const validVolume = volume => {
  let errors = {};
  if (isEmpty(volume.startDate)) {
    errors.startDate = "startDate can not be empty";
  }

  if (isEmpty(volume.endDate)) {
    errors.endDate = "endDate can not be empty";
  }

  if (isEmpty(volume.VolumeNo)) {
    errors.VolumeNo = "VolumeNo can not be empty";
  }

  if (isEmpty(volume.subVolume)) {
    errors.subVolume = "subVolume can not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

module.exports = {
  vaidationSignUp,
  vaidationSignIn,
  validVolume
};
