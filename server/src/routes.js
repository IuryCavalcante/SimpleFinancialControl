import express from 'express';
import TransactionController from './Controllers/TransactionController.js';

const routes = express.Router();
const transactionController = new TransactionController();

routes.get('/transaction', transactionController.getYearWithMonth);
routes.get(
  '/transaction/allYearsWithMonths',
  transactionController.getAllYearsWithMonths
);
routes.get('/transaction/populate', transactionController.populateDatabase);

// funcao tratamento de erro
routes.use((err, req, res, next) => {
  res.status(400).send({ error: err.message });
});

export default routes;
