import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    getAllMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    deleteMembership
} from '../controllers/membershipController.js';
const router = Router();

router.get('/memberships', getAllMemberships);
router.get('/memberships/:id', verifyToken, getMembershipById);
router.post('/memberships', verifyToken, createMembership);
router.put('/memberships/:id', verifyToken, updateMembership);
router.delete('/memberships/:id', verifyToken, deleteMembership);

export default router;