import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
const port = 3000;

// Create a PostgreSQL pool
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

app.use(express.json());

app.get('/awesome/applicant', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM applicants');
    const applicants = result.rows;
    client.release();

    res.json(applicants);
  } catch (error) {
    console.error('Error retrieving applicants:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/awesome/applicant', async (req: Request, res: Response) => {
  const { name, picture, bio } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO applicants (name, picture, bio) VALUES ($1, $2, $3) RETURNING *',
      [name, picture, bio]
    );
    const newApplicant = result.rows[0];
    client.release();

    res.status(201).json(newApplicant);
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/awesome/applicant/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, picture, bio } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE applicants SET name = $1, picture = $2, bio = $3 WHERE id = $4 RETURNING *',
      [name, picture, bio, id]
    );
    const updatedApplicant = result.rows[0];
    client.release();

    if (!updatedApplicant) {
      res.status(404).send('Applicant not found');
    } else {
      res.json(updatedApplicant);
    }
  } catch (error) {
    console.error('Error updating applicant:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/awesome/applicant/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM applicants WHERE id = $1 RETURNING *', [id]);
    const deletedApplicant = result.rows[0];
    client.release();

    if (!deletedApplicant) {
      res.status(404).send('Applicant not found');
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error('Error deleting applicant:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
