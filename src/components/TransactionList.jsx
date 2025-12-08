import { Trash2, TrendingUp, TrendingDown, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';

export default function TransactionList({ transactions, onDelete }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
          <div className="flex items-center justify-center h-full w-full rounded-full bg-gray-100">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Add your first transaction to start tracking your finances
        </p>
      </div>
    );
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    
    if (sortBy === 'date') {
      return dateB - dateA; // Newest first
    } else if (sortBy === 'amount') {
      return parseFloat(b.amount) - parseFloat(a.amount); // Highest first
    }
    return dateB - dateA;
  });

  // Group transactions by date
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = transaction.createdAt?.toDate?.() || new Date(transaction.createdAt);
    const dateKey = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700">Filter:</div>
          <div className="flex space-x-2">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filterType === type
                    ? type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : type === 'expense'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700">Sort by:</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="date">Date (newest)</option>
            <option value="amount">Amount (highest)</option>
          </select>
        </div>
      </div>

      {/* Transactions Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Showing {filteredTransactions.length} of {transactions.length} transactions</p>
            <p className="text-sm text-gray-600">
              {filterType === 'all' && `${transactions.filter(t => t.type === 'income').length} income, ${transactions.filter(t => t.type === 'expense').length} expense`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Current filter:</p>
            <p className={`text-sm font-semibold ${
              filterType === 'income' ? 'text-green-600' : 
              filterType === 'expense' ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {filterType === 'all' ? 'All Transactions' : 
               filterType === 'income' ? 'Income Only' : 'Expense Only'}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-8">
        {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="sticky top-0 z-10 bg-white pt-4 pb-2 border-b">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">{date}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {dateTransactions.length} transaction{dateTransactions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Transactions for this date */}
            <div className="space-y-3">
              {dateTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      {/* Left side: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : (
                              <TrendingDown className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {transaction.description}
                            </h4>
                            <div className="flex items-center mt-1">
                              <Tag className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {transaction.category}
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                {transaction.createdAt?.toDate
                                  ? transaction.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Amount and Actions */}
                      <div className="flex items-center space-x-4 ml-4">
                        <div className={`text-right ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div className="text-lg font-bold">
                            {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div>
            Total displayed: <span className="font-semibold">{filteredTransactions.length} transactions</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>
                Income: ${filteredTransactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>
                Expense: ${filteredTransactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}