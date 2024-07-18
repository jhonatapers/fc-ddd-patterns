import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../entity/customer";
import CustomerService from "./cutomer.service";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleLogWhenCustomerIsCreated1Handler from "../event/handler/send-console-log-when-customer-is-created-1.handler";
import SendConsoleLogWhenCustomerIsCreated2Handler from "../event/handler/send-console-log-when-customer-is-created-2.handler";
import SendConsoleLogWhenCustomerChangedAddressHandler from "../event/handler/send-console-log-when-customer-changed-address.handler";

describe("Customer service unit tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a cutomer", async () => {
        const customer = new Customer("123", "name");
        const address = new Address("street one", 123, "00000000", "city");
        customer.changeAddress(address);

        const customerRepository = new CustomerRepository();
        const customerService = new CustomerService(customerRepository);

        await customerService.createCustomer(customer);
        const result = await customerRepository.find("123");

        expect(result).toStrictEqual(customer);
    });

    it("should create a cutomer and notify event dispatcher", async () => {
        const customer = new Customer("123", "name");
        const address = new Address("street one", 123, "00000000", "city");
        customer.changeAddress(address);

        const customerRepository = new CustomerRepository();
        const dispatcher = new EventDispatcher();


        const sendConsoleLogWhenCustomerIsCreated1Handler = new SendConsoleLogWhenCustomerIsCreated1Handler();
        const spyEventHandler1 = jest.spyOn(sendConsoleLogWhenCustomerIsCreated1Handler, "handle");
        dispatcher.register('CustomerCreatedEvent', sendConsoleLogWhenCustomerIsCreated1Handler);

        const sendConsoleLogWhenCustomerIsCreated2Handler = new SendConsoleLogWhenCustomerIsCreated2Handler();
        const spyEventHandler2 = jest.spyOn(sendConsoleLogWhenCustomerIsCreated2Handler, "handle");
        dispatcher.register('CustomerCreatedEvent', sendConsoleLogWhenCustomerIsCreated2Handler);

        const customerService = new CustomerService(customerRepository, dispatcher);

        await customerService.createCustomer(customer);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();

        const result = await customerRepository.find("123");

        expect(result).toStrictEqual(customer);
    });

    it("should change a customer address", async () => {
        const customer = new Customer("123", "name");
        const address1 = new Address("street one", 123, "00000000", "city");
        customer.changeAddress(address1);

        const customerRepository = new CustomerRepository();

        await customerRepository.create(customer);

        const address2 = new Address("street one", 124, "00000000", "city");
        customer.changeAddress(address2);

        const customerService = new CustomerService(customerRepository);

        await customerService.changeAddress(customer.id, address2);

        const result = await customerRepository.find("123");

        expect(result.Address).toStrictEqual(address2);
    });


    it("should change a customer address and notify event dispatcher", async () => {
        const customer = new Customer("123", "name");
        const address1 = new Address("street one", 123, "00000000", "city");
        customer.changeAddress(address1);

        const customerRepository = new CustomerRepository();

        await customerRepository.create(customer);

        const address2 = new Address("street one", 124, "00000000", "city");
        customer.changeAddress(address2);


        const dispatcher = new EventDispatcher();
        const sendConsoleLogWhenCustomerChangedAddressHandler = new SendConsoleLogWhenCustomerChangedAddressHandler();
        const spyEventHandler = jest.spyOn(sendConsoleLogWhenCustomerChangedAddressHandler, "handle");
        dispatcher.register('CustomerAddressChangedEvent', sendConsoleLogWhenCustomerChangedAddressHandler);

        const customerService = new CustomerService(customerRepository, dispatcher);
        await customerService.changeAddress(customer.id, address2);

        const result = await customerRepository.find("123");

        expect(result.Address).toStrictEqual(address2);
        expect(spyEventHandler).toHaveBeenCalled();
    });

});
