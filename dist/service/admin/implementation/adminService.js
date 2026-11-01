"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminService {
    _adminRepository;
    constructor(adminRepository) {
        this._adminRepository = adminRepository;
    }
    async getUsers(params) {
        const [users, totalUsers] = await Promise.all([
            this._adminRepository.getUsers(params),
            this._adminRepository.getUserCount(),
        ]);
        return { users: users ?? null, total: totalUsers, };
    }
    async getUserById(userId) {
        const user = await this._adminRepository.getUserById(userId);
        return user;
    }
    async userUpdateStatus(userId, status) {
        const user = await this._adminRepository.userUpdateStatus(userId, status);
        return user;
    }
    async getExperts(params) {
        const [experts, totalExperts] = await Promise.all([
            this._adminRepository.getExperts(params),
            this._adminRepository.getExpertCount(),
        ]);
        return { experts: experts ?? null, total: totalExperts, };
    }
    async expertUpdateStatus(expertId, status) {
        const expert = await this._adminRepository.expertUpdateStatus(expertId, status);
        return expert;
    }
    async getExpertById(expertId) {
        const expert = await this._adminRepository.getExpertById(expertId);
        return expert;
    }
    async approveExpert(expertId) {
        const expert = await this._adminRepository.approveExpert(expertId);
        return expert;
    }
    async declineExpert(expertId) {
        const expert = await this._adminRepository.declineExpert(expertId);
        return expert;
    }
    async getOrders(params) {
        return this._adminRepository.getOrders(params);
    }
    async getPaidOrders() {
        const order = await this._adminRepository.getPaidOrders();
        return order;
    }
    async getStats() {
        const [totalCustomers, totalExperts] = await Promise.all([
            this._adminRepository.getUserCount(),
            this._adminRepository.getExpertCount(),
        ]);
        return { totalCustomers, totalExperts };
    }
}
exports.default = AdminService;
//# sourceMappingURL=adminService.js.map