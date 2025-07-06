import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import pino from 'pino-http';
import { getStudentById, getAllStudents } from './services/students.js';


export const startServer = () => {

    const PORT = getEnvVar("PORT", 3000);

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

    app.get('/students', async (req, res) => {
        const students = await getAllStudents();
        res.json({
            status: 201,
            message: 'Successfully found contacts!',
            data: students
        });
    });

    app.get('/students/:id', async (req, res) => {
        const studentId = req.params.id;
        const student = await getStudentById(studentId);

        if (!student) {
            res.status(404).json({
                message: 'Contact not found'
            });
            return;
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id ${studentId}!`,
            data: student,
        });
    });

    app.get((req, res) => {
        res.status(404).json({
            status: 404,
            message: 'Not found',
        });
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message,
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};