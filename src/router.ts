import express from "express";
import AuthRoutes from './core/auth';

const router = express.Router();

router.use(AuthRoutes);
// router.use(require("./core/areas"));
// router.use(require("./core/categories"));
// router.use(require("./core/clients"));
// router.use(require("./core/companies"));
// router.use(require("./core/jobs"));
// router.use(require("./core/materials"));
// router.use(require("./core/orders"));
// router.use(require("./core/permissions"));
// router.use(require("./core/quotes"));
// router.use(require("./core/roles"));
// router.use(require("./core/services"));
// router.use(require("./core/stocks"));
// router.use(require("./core/suppliers"));
// router.use(require("./core/users"));
// router.use(require("./core/warehouses"));
// router.use(require("./core/workers"));

export default router;
