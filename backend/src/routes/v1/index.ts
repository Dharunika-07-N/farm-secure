import { Router } from 'express';
import authRoutes from './auth.routes';
import farmRoutes from './farm.routes';
import cropRoutes from './crop.routes';
import transactionRoutes from './transaction.routes';
import inventoryRoutes from './inventory.routes';
import dashboardRoutes from './dashboard.routes';
import outbreakRoutes from './outbreak.routes';
import syncRoutes from './sync.routes';
import notificationRoutes from './notification.routes';
import riskAssessmentRoutes from './risk-assessment.routes';
import staffRoutes from './staff.routes';
import trainingRoutes from '../training.routes';
import diseaseRoutes from '../disease.routes';
import livestockRoutes from './livestock.routes';
import visitorRoutes from './visitor.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/transactions', transactionRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/outbreaks', outbreakRoutes);
router.use('/sync', syncRoutes);
router.use('/notifications', notificationRoutes);
router.use('/risk-assessment', riskAssessmentRoutes);
router.use('/staff', staffRoutes);
router.use('/livestock', livestockRoutes);
router.use('/visitors', visitorRoutes);
// ... existing imports
import analyticsRoutes from '../analytics.routes';

router.use('/training', trainingRoutes);
router.use('/diseases', diseaseRoutes);
router.use('/analytics', analyticsRoutes);



router.get('/', (req, res) => {
    res.json({
        message: "API v1 is running",
        endpoints: {
            auth: "/auth",
            dashboard: "/dashboard",
            farms: "/farms"
        }
    });
});

export default router;
