
import express from "express";
import authRouter from "./auth.route";
import carRouter from "./car.route";
import showRoomRouter from "./showRoom";
import favoriteRouter from "./favorite";
import bookingRouter from "./booking";
import brandRoutes from "./brand.route";
import locationRoutes from "./location.route";
import uploadfile from "./uploadFile";
import NotificationRoutes from "./notification";

const router = express.Router();

router.use("/auth", authRouter);
router.use('/car', carRouter)
router.use('/favorite', favoriteRouter)
router.use('/showroom', showRoomRouter)
router.use('/booking', bookingRouter)
router.use('/upload', uploadfile)
router.use('/brand', brandRoutes);
router.use('/location', locationRoutes);
router.use('/Notification', NotificationRoutes);

export default router;
