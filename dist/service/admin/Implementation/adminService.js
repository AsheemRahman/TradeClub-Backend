"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AdminService {
    constructor(adminRepository) {
        this._adminRepository = adminRepository;
    }
    getUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, totalUsers] = yield Promise.all([
                this._adminRepository.getUsers(params),
                this._adminRepository.getUserCount(),
            ]);
            return { users: users !== null && users !== void 0 ? users : null, total: totalUsers, };
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._adminRepository.getUserById(userId);
            return user;
        });
    }
    userUpdateStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._adminRepository.userUpdateStatus(userId, status);
            return user;
        });
    }
    getExperts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const [experts, totalExperts] = yield Promise.all([
                this._adminRepository.getExperts(params),
                this._adminRepository.getExpertCount(),
            ]);
            return { experts: experts !== null && experts !== void 0 ? experts : null, total: totalExperts, };
        });
    }
    expertUpdateStatus(expertId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this._adminRepository.expertUpdateStatus(expertId, status);
            return expert;
        });
    }
    getExpertById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this._adminRepository.getExpertById(expertId);
            return expert;
        });
    }
    approveExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this._adminRepository.approveExpert(expertId);
            return expert;
        });
    }
    declineExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield this._adminRepository.declineExpert(expertId);
            return expert;
        });
    }
    getOrders(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._adminRepository.getOrders(params);
        });
    }
    getPaidOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this._adminRepository.getPaidOrders();
            return order;
        });
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalCustomers, totalExperts] = yield Promise.all([
                this._adminRepository.getUserCount(),
                this._adminRepository.getExpertCount(),
            ]);
            return { totalCustomers, totalExperts };
        });
    }
}
exports.default = AdminService;
