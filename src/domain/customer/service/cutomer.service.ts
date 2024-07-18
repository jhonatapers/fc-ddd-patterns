import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerRepositoryInterface from "../repository/customer-repository.interface";

export default class CustomerService {

    private customerRepository: CustomerRepositoryInterface;

    private dispatcher: EventDispatcherInterface;

    constructor(customerRepository: CustomerRepositoryInterface, dispatcher: EventDispatcherInterface = null) {
        this.customerRepository = customerRepository;
        this.dispatcher = dispatcher;
    }

    withCustomerRepository(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    createCustomer(customer: Customer): void {

        if (!this.customerRepository)
            throw Error('CustomerRepositoryInterface not defined')

        this.customerRepository.create(customer);

        if (this.dispatcher)
            this.dispatcher.notify(new CustomerCreatedEvent(customer))

    }

}