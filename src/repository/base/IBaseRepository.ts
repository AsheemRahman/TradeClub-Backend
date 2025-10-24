export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    findByIdAndUpdate(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}
