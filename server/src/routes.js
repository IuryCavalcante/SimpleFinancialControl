import express from 'express';
import TransactionController from './Controllers/TransactionController.js';

const routes = express.Router();
const transactionController = new TransactionController();

routes.get(
  '/transaction/sumaryAllMonths',
  transactionController.sumaryAllMonths
);

routes.get('/transaction/populate', transactionController.populateDatabase);
routes.get('/transaction/:id', transactionController.findOne);
routes.get('/transaction/', transactionController.findAll);
routes.put('/transaction/:id', transactionController.update);
routes.delete('/transaction/:id', transactionController.remove);
routes.post('/transaction', transactionController.create);

// funcao tratamento de erro
routes.use((err, req, res, next) => {
  res.status(400).send({ error: err.message });
});

export default routes;
