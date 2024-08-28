const express = require('express');
const app = express();
const port = 3000;
const mo = require('./middleware/auth');
app.use(express.json());

const authRoutes = require('./routes/auth/auth');
const todoRoutes = require('./routes/todos/todos');
const userRoutes = require('./routes/user/user');

app.get('/', (req, res) => {
    return res.json(`EPYTODO`);
});

app.use('/', authRoutes);
app.use('/todos', mo, todoRoutes);
app.use('/', mo, userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
