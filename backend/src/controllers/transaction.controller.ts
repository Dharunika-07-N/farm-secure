import { Request, Response } from 'express';
import * as transactionService from '@/services/transaction.service';
import asyncHandler from '@/utils/asyncHandler';

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { farmId, ...rest } = req.body;
    const transaction = await transactionService.createTransaction({
        ...rest,
        farm: { connect: { id: farmId } }
    });
    res.status(201).json({ success: true, data: transaction });
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.query;
    if (!farmId) {
        res.status(400);
        throw new Error("farmId query parameter is required");
    }
    const transactions = await transactionService.getTransactionsByFarm(farmId as string);
    res.status(200).json({ success: true, data: transactions });
});

export const getTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    res.status(200).json({ success: true, data: transaction });
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    res.status(200).json({ success: true, data: transaction });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    await transactionService.deleteTransaction(req.params.id);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
});
