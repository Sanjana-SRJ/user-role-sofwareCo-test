import { connectToDatabase } from './db/db.js';
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import routes from './v1/routes/routes.js'

const app = express();
config();
app.use(json());
app.use(cors());
// Disable the X-Powered-By header
app.disable('x-powered-by');

// Connect to the database
try {
  await connectToDatabase();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
}
// Import & Define API versions
app.use('/v1', routes);


app.use('/', (req, res) => {
  res.send("Invalid API")
});

// Start the server
const port = process.env.PORT || 4003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
