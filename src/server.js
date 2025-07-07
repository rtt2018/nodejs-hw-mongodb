import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import pino from 'pino-http';
import { getContactsById, getAllContacts } from './services/contacts.js';


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

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.json({
            status: 201,
            message: 'Successfully found contacts!',
            data: contacts
        });
    });

    app.get('/contacts/:id', async (req, res) => {
        const contactId = req.params.id;
        const contact = await getContactsById(contactId);

        if (!contact) {
            res.status(404).json({
                message: 'Contact not found'
            });
            return;
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    });

    app.use((req, res) => {
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