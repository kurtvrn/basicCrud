const express = require('express');
const path = require('path');
const db = require('./firebase-config');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint for creating users
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const docRef = await db.collection('users').add({
      name,
      email,
      createdAt: new Date()
    });

    res.status(201).json({ 
      id: docRef.id,
      message: 'User created successfully'
    });
  } catch (err) {
    console.error('Error adding document: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint for retrieving users
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(users);
  } catch (err) {
    console.error('Error getting documents: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});