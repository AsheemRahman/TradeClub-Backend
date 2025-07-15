import IOrderRepository from "../../../repository/user/IOrderRepository";
import IOrderService from "../IOrderService";


class OrderService implements IOrderService {
    private orderRepository: IOrderRepository;

    constructor(orderRepository: IOrderRepository) {
        this.orderRepository = orderRepository;
    };

}


export default OrderService;