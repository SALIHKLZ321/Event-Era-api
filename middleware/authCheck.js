import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_code');
    const payLoad = jwt.verify(token, 'secret_code');
    req.user = payLoad;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed' });
  }
};
const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_admin');
    const payload = jwt.verify(token, 'secret_admin');
    req.admin = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed' });
  }
};
const vendorAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_vendor');
    const payload = jwt.verify(token, 'secret_vendor');
    req.vendor = payload;
    next();
  } catch (err) {
    console.log('auth deny', err);
    res.status(401).json({ message: 'Auth failed' });
  }
};
export {
  userAuth,
  adminAuth,
  vendorAuth,
};
