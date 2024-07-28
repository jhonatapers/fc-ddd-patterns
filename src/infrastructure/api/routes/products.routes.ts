import express, { Request, Response } from 'express';
import ListProductsUseCase from '../../../usecase/product/list/list.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';

export const productRoutes = express.Router();

productRoutes.get("/", async (req: Request, res: Response) => {

    const usecase = new ListProductsUseCase(new ProductRepository());

    try {
        const output = await usecase.execute({});
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});