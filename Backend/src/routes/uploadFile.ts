
import express from "express";
import { uploadfile } from "../services/uploadFiles";

const router = express.Router();

router.use("/anyfile", uploadfile);

export default router;
