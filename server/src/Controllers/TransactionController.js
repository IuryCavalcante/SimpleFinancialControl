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

  async getYearWithMonth(req, res, next) {
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

  async getAllYearsWithMonths(req, res, next) {
    try {
      let allYearsMonths = await TransactionModel.aggregate([
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
                    $eq: ['$type', '+'],
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
                    $eq: ['$type', '-'],
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

      const allYearsMonthsComplete = [];
      for (let index = 1; index < allYearsMonths.length; index++) {
        const { _id, total, despesas, receitas } = allYearsMonths[index - 1];
        const yearMonth = _id;
        const yearMonthShort = formatShortMonth(
          yearMonth.split('-')[0],
          yearMonth.split('-')[1],
          1
        );
        allYearsMonthsComplete.push({
          id: index,
          yearMonth,
          yearMonthShort,
          despesas,
          receitas,
          saldo: despesas - receitas,
          lancamentos: total,
        });
      }
      res.json(allYearsMonthsComplete);
    } catch (error) {
      next(error);
    }
  }
}
