import { Router } from 'express';

const router = Router();

router.get('/classes', (req, res) => {
    res.send('Classes route working!');
});

router.get('/classes/:id', (req, res) => {
    const classId = req.params.id;
    res.send(`Class ID: ${classId}`);
});

router.post('/classes', (req, res) => {
    res.send('Create a new class');
});

router.put('/classes/:id', (req, res) => {
    const classId = req.params.id;
    res.send(`Update class with ID: ${classId}`);
});

router.delete('/classes/:id', (req, res) => {
    const classId = req.params.id;
    res.send(`Delete class with ID: ${classId}`);
});

export default router;