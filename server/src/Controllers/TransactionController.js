import { promises as fs } from 'fs';
import { isValidPeriod } from '../helpers/validatePeriod.js';
import { formatShortMonth } from '../helpers/formatHelpers.js';
import TransactionModel from '../Models/TransactionModel.js';

export default class ClassesController {
  async populateDatabase(req, res, next) {
    try {
      await TransactionModel.deleteMany();
      const stringArrayTransactions = await fs.readFile(
        './src/data/transactionsArray.json',
        'utf-8'
      );
      const transactions = JSON.parse(stringArrayTransactions);
      await TransactionModel.insertMany(transactions);

      res.send(`Transactions: ${transactions.length}`);
    } catch (error) {
      next(error);
    }
  }

  async yearMonthWithTotal(req, res, next) {
    try {
      let yearMonth = req.query.period;
      isValidPeriod(yearMonth);
      yearMonth = await TransactionModel.find({ yearMonth });
      const yearMonthWithTotal = {
        totalTransaction: yearMonth.length,
        transaction: yearMonth,
      };
      res.send(yearMonthWithTotal);
    } catch (error) {
      next(error);
    }
  }

  async sumaryAllMonths(req, res, next) {
    try {
      let data = await TransactionModel.aggregate([
        {
          $group: {
            _id: '$yearMonth',
            total: {
              $sum: 1,
            },
            despesas: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ['$type', '-'],
                  },
                  then: {
                    $sum: '$value',
                  },
                  else: 0,
                },
              },
            },
            receitas: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ['$type', '+'],
                  },
                  then: {
                    $sum: '$value',
                  },
                  else: 0,
                },
              },
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

      const sumary = [];
      for (let index = 0; index < data.length; index++) {
        if (data[index]._id != null) {
          const { _id, total, despesas, receitas } = data[index];
          const yearMonth = _id;

          sumary.push({
            id: index,
            yearMonth,
            despesas,
            receitas,
            saldo: receitas - despesas,
            lancamentos: total,
          });
        }
      }
      res.json(sumary);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    const id = req.params.id;

    try {
      let data = await TransactionModel.findById({ _id: id });

      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      let yearMonth = req.query.period;
      let descriptionFilter = req.query.description;
      isValidPeriod(yearMonth);

      //condicao para o filtro no findAll

      var condition = descriptionFilter
        ? {
            yearMonth: yearMonth,
            description: {
              $regex: new RegExp(descriptionFilter),
              $options: 'i',
            },
          }
        : {
            yearMonth: yearMonth,
          };

      const data = await TransactionModel.find(condition);

      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const {
        description,
        value,
        category,
        year,
        month,
        day,
        yearMonth,
        yearMonthDay,
        type,
      } = req.body;

      const data = new TransactionModel({
        description,
        value,
        category,
        year,
        month,
        day,
        yearMonth,
        yearMonthDay,
        type,
      });

      await data.save();

      res.send({ message: 'Transação inserida com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    if (!req.body) {
      return res.status(400).send({
        message: 'Dados para atualizacao vazio',
      });
    }
    const {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    } = req.body;
    const id = req.params.id;

    try {
      const data = await TransactionModel.findByIdAndUpdate(
        { _id: id },
        {
          description,
          value,
          category,
          year,
          month,
          day,
          yearMonth,
          yearMonthDay,
          type,
        },
        {
          new: true,
        }
      );

      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    const id = req.params.id;

    try {
      await TransactionModel.findByIdAndDelete({ _id: id });

      res.end();
    } catch (error) {
      next(error);
    }
  }
}
