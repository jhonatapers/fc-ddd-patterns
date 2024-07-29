import { toXML } from "jstoxml";
import { OutputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";
import { AllowNull } from "sequelize-typescript";

export default class CustomerPresenter {

    static toXml(data: OutputListCustomerDto): string {

        const xmlOptions = {
            header: true,
            ident: "    ",
            newLine: "\n",
            allowEmpty: true,
        };

        return toXML({
            customers: {
                customer: data.customers.map((customer) => ({
                    id: customer.id,
                    name: customer.name,
                    address: {
                        street: customer.address.street,
                        number: customer.address.number,
                        zip: customer.address.zip,
                        city: customer.address.city,
                    }
                })),
            }
        }, xmlOptions);

    }
}