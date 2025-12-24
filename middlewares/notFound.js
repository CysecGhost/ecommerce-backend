import AppError from "../utils/AppError.js";
const notFound = (req, res, next) => {
  return next(new AppError(`${req.originalUrl} - Doesn't Exist`, 404));
};

export default notFound;
