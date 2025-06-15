const User = require('../models/User');

async function seedAdmin() {
  const adminEmail = 'admin@journohub1.com';
  const adminPassword = 'Admin123!'; // Change after first login
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      name: 'Admin',
    });
    console.log('Admin user created:', adminEmail, adminPassword);
  } else {
    // Always update the password to ensure you can log in
    existing.password = adminPassword;
    existing.role = 'admin';
    existing.name = 'Admin';
    await existing.save();
    console.log('Admin user updated:', adminEmail, adminPassword);
  }
}

module.exports = seedAdmin; 