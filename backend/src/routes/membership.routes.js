import { Router } from 'express';
import {
    getAllMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    deleteMembership
} from '../controllers/membershipController.js';
const router = Router();

router.get('/memberships', getAllMemberships);
router.get('/memberships/:id', getMembershipById);
router.post('/memberships', createMembership);
router.put('/memberships/:id', updateMembership);
router.delete('/memberships/:id', deleteMembership);

export default router;