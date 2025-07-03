import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import pino from 'pino-http';
import { contacts } from './db/db.js';

const PORT = getEnvVar("PORT", 3000);
console.log("🚀 ~ PORT:", PORT);

const app = express();
app.use(cors());
app.use(
    pino({
        transport: {
            target: 'pino-pretty',
        },
    }),
);

app.get('/', (req, res) => {
    res.json({
        message: 'Hello world!',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

app.get('/students', (req, res) => {
    res.json({
        status: 200,
        message: 'Students list',
        data: [
            { name: 'John Doe', age: 20 },
            { name: 'Jane Smith', age: 22 },
        ],
    });
});


app.get('/students/:id', (req, res) => {
    const studentId = req.params.id;
    res.json({
        status: 200,
        message: `Student with ID ${studentId}`,
        data: { name: 'John Doe', age: 20 },
    });
});


app.post('/students', (req, res) => {
    res.status(201).json({
        status: 201,
        message: 'Student created successfully',
        data: contacts
    });
});

app.get('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Not Found',
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        message: 'Something went wrong',
        error: err.message,
    });
});