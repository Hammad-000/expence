import { useState } from 'react';
import { PlusCircle, DollarSign, FileText, Tag } from 'lucide-react';

export default function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Other'],
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!description || !amount || !category) {
      alert('Please fill in all fields');
      return;
    }

    onAdd({
      description,
      amount: parseFloat(amount),
      type,
      category
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              type === 'expense'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`text-lg font-semibold ${type === 'expense' ? 'text-red-600' : 'text-gray-600'}`}>
                Expense
              </div>
              <div className="text-sm mt-1">Money Out</div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              type === 'income'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`text-lg font-semibold ${type === 'income' ? 'text-green-600' : 'text-gray-600'}`}>
                Income
              </div>
              <div className="text-sm mt-1">Money In</div>
            </div>
          </button>
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Description
          </div>
        </label>
        <div className="relative">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter transaction description"
            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Amount Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Amount
          </div>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3.5 text-gray-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
          <div className="absolute right-3 top-3.5 text-gray-500">
            USD
          </div>
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Category
          </div>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories[type].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                category === cat
                  ? type === 'income'
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className={`text-sm font-medium ${category === cat ? 'font-semibold' : ''}`}>
                {cat}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
          type === 'income'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
            : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
        }`}
      >
        <PlusCircle className="h-5 w-5" />
        <span>Add Transaction</span>
      </button>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Selected type:</span>
            <span className={`font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {type === 'income' ? 'Income' : 'Expense'}
            </span>
          </div>
          {amount && (
            <div className="flex justify-between mt-1">
              <span>Amount:</span>
              <span className={`font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                ${parseFloat(amount).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}