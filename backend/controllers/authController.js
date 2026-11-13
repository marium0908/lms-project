const jwt = require('jsonwebtoken');

const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: { email },
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};

module.exports = { loginAdmin };
