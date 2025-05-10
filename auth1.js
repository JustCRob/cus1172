const express = require('express');
const fs = require('fs');
router = express.Router();

const usersData = './data/users.json';

const readUsers= () => {
      if (!fs.existsSync(usersData)) {
        fs.writeFileSync(usersData, JSON.stringify({ users: [] }));
      }
      else {
      const data = fs.readFileSync(usersData);
      return JSON.parse(data);
    }
  };
  
  
  const saveUsers = (db) => {
    fs.writeFileSync(usersData, JSON.stringify(db));
  };

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
    const missingFields = [];
    if (!username) missingFields.push('Username');
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
  
    if (missingFields.length > 0) {
      const errorMessage = `Missing: ${missingFields.join(', ')}`;
      return res.redirect(`/auth1/register?error=${encodeURIComponent(errorMessage)}`);
    }
  
    const db = readUsers();
    const users = db.users;
  
    const newUser = { username, email, password };
    users.push(newUser);
  
    saveUsers({ users });
  
    res.render('account_created', { username });
  });

  router.get('/login', (req, res) => {
    res.render('login');
  }
  );
  
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const missingFields = [];
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
  
    if (missingFields.length > 0) {
      const errorMessage = `Missing: ${missingFields.join(', ')}`;
      return res.redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
    }

    const db = readUsers();
    const users = db.users;
  
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      return res.redirect('/auth/login?error=' + encodeURIComponent('Invalid email or password.'));
    }

    req.session.user = {
      username: user.username,
      email: user.email
    };
  
    res.render('dashboard', { username: user.username });
  });

  module.exports = router;