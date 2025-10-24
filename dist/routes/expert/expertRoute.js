"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../../middleware/verify");
const role_1 = require("../../constants/role");
const expertDI_1 = require("../../di/expertDI");
const router = (0, express_1.Router)();
//------------------------------- register routes -------------------------------
router.post('/register', expertDI_1.expertControllerInstance.registerPost.bind(expertDI_1.expertControllerInstance));
router.post('/verify-otp', expertDI_1.expertControllerInstance.verifyOtp.bind(expertDI_1.expertControllerInstance));
router.post('/resend-otp', expertDI_1.expertControllerInstance.resendOtp.bind(expertDI_1.expertControllerInstance));
//--------------------------------- login routes --------------------------------
router.post('/login', expertDI_1.expertControllerInstance.loginPost.bind(expertDI_1.expertControllerInstance));
router.get('/logout', expertDI_1.expertControllerInstance.logout.bind(expertDI_1.expertControllerInstance));
router.post('/google-login', expertDI_1.expertControllerInstance.googleLogin.bind(expertDI_1.expertControllerInstance));
//------------------------------- forgot-password -------------------------------
router.post('/forgot-password', expertDI_1.expertControllerInstance.forgotPassword.bind(expertDI_1.expertControllerInstance));
router.patch('/reset-password', expertDI_1.expertControllerInstance.resetPassword.bind(expertDI_1.expertControllerInstance));
router.post('/verification', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.expertControllerInstance.expertVerification.bind(expertDI_1.expertControllerInstance));
//------------------------------------ profile ----------------------------------
router.get('/get-expert', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.expertControllerInstance.getExpertData.bind(expertDI_1.expertControllerInstance));
router.post('/update-profile', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.expertControllerInstance.updateProfile.bind(expertDI_1.expertControllerInstance));
//------------------------------------- Slot ------------------------------------
router.get('/slots', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.getSlots.bind(expertDI_1.sessionInstance));
router.post('/add-slot', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.addSlot.bind(expertDI_1.sessionInstance));
router.patch('/edit-slot', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.editSlot.bind(expertDI_1.sessionInstance));
router.delete('/delete-slot/:id', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.deleteSlot.bind(expertDI_1.sessionInstance));
//----------------------------------- Dashboard ---------------------------------
router.get('/dashboard/stats', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.getDashboardStats.bind(expertDI_1.sessionInstance));
router.get('/dashboard/analytics', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.getSessionAnalytics.bind(expertDI_1.sessionInstance));
//------------------------------------ wallet -----------------------------------
router.get('/wallet', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.expertControllerInstance.getWallet.bind(expertDI_1.expertControllerInstance));
//------------------------------------ sessions ----------------------------------
router.get('/sessions', (0, verify_1.validate)(role_1.ROLE.EXPERT), expertDI_1.sessionInstance.getSessions.bind(expertDI_1.sessionInstance));
exports.default = router;
