const express = require('express');
const db = require('./db'); 

const app = express();
app.use(express.json()); 

// Insert New User
app.post('/add-user', async (req, res) => {
  const { first_name, last_name, email, whatsapp_num, program } = req.body;

  try {
    // Insert the new student into the database
    const [result] = await db.query(
      'INSERT INTO Users (first_name, last_name, email, whatsapp_num, program) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, whatsapp_num, program]
    );

    res.status(201).json({ message: 'User added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add User' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM Users');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete a User by ID
app.delete('/delete-user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Users WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: `User with id ${id} deleted successfully` });
    } else {
      res.status(404).json({ error: `User with id ${id} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// Update a user by ID with optional fields
app.put('/update-user/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, whatsapp_num, program } = req.body;

  try {
    // Build the query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (first_name) {
      updates.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name) {
      updates.push('last_name = ?');
      values.push(last_name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (whatsapp_num) {
      updates.push('whatsapp_num = ?');
      values.push(whatsapp_num);
    }
    if (program) {
      updates.push('program = ?');
      values.push(program);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    values.push(id);

    const query = `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`;

    const [result] = await db.query(query, values);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: `User with id ${id} updated successfully` });
    } else {
      res.status(404).json({ error: `User with id ${id} not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
