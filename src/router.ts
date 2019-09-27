import { Router } from "express";

const router = Router();

router.use(require('./core/auth').default);
router.use(require('./core/areas').default);
router.use(require('./core/categories').default);
router.use(require('./core/clients').default);
router.use(require('./core/companies').default);
router.use(require('./core/jobs').default);
router.use(require('./core/materials').default);
router.use(require('./core/orders').default);
router.use(require('./core/permissions').default);
router.use(require('./core/quotes').default);
router.use(require('./core/roles').default);
router.use(require('./core/services').default);
router.use(require('./core/stocks').default);
router.use(require('./core/suppliers').default);
router.use(require('./core/users').default);
router.use(require('./core/warehouses').default);
router.use(require('./core/workers').default);

export default router;
