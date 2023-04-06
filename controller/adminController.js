import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/extensions
import adminModel from '../model/adminModel.js';

const adminLogin = (req, res) => {
  const { email, password } = req.body;
  adminModel.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return res.status(401).json({
          status: 'adminFail',
          message: 'auth denied',
        });
      }
      return bcrypt.compare(password, admin.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({
              status: 'passFail',
              message: 'auth denied',
            });
          }
          // eslint-disable-next-line no-underscore-dangle
          const token = jwt.sign({ email: admin.email, adminId: admin._id, fullName: admin.name }, 'secret_admin', { expiresIn: '1h' });
          return res.status(200).json({
            status: 'success',
            token,
            role: 'admin',
            expiresIn: 3600,
          });
        }).catch((err) => {
          res.json({
            err,
          });
        });
    });
};

export default adminLogin;
