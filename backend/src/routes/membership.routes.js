import { Router } from 'express';

const router = Router();

router.get('/memberships', (req, res) => {
    res.send('Memberships route working!');
});

router.get('/memberships/:id', (req, res) => {
    const membershipId = req.params.id;
    res.send(`Membership ID: ${membershipId}`);
});

router.post('/memberships', (req, res) => {
    res.send('Create a new membership');
});

router.put('/memberships/:id', (req, res) => {
    const membershipId = req.params.id;
    res.send(`Update membership with ID: ${membershipId}`);
});

router.delete('/memberships/:id', (req, res) => {
    const membershipId = req.params.id;
    res.send(`Delete membership with ID: ${membershipId}`);
});

export default router;