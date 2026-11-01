"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findAll() {
        return this.model.find().exec();
    }
    async findByIdAndUpdate(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=baseRepository.js.map