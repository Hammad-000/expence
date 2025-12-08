import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { LogOut, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function handleAddTransaction(transaction) {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: currentUser.uid,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }

  async function handleDeleteTransaction(id) {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Finance Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back</p>
                <p className="font-medium text-gray-900">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Income</p>
                <p className="text-3xl font-bold text-green-900">${totalIncome.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-2">All time earnings</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Total Expense</p>
                <p className="text-3xl font-bold text-red-900">${totalExpense.toFixed(2)}</p>
                <p className="text-xs text-red-600 mt-2">All time spendings</p>
              </div>
              <div className="bg-red-500 p-3 rounded-full">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 shadow-sm border ${balance >= 0 ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${balance >= 0 ? 'text-blue-700' : 'text-amber-700'} mb-1`}>Balance</p>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-amber-900'}`}>
                  ${balance.toFixed(2)}
                </p>
                <p className={`text-xs ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'} mt-2`}>
                  {balance >= 0 ? 'Positive balance' : 'Negative balance'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-blue-500' : 'bg-amber-500'}`}>
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Transaction</h2>
              <TransactionForm onAdd={handleAddTransaction} />
            </div>
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="px-6 py-5 border-b">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} total
                </p>
              </div>
              <div className="overflow-x-auto">
                <TransactionList
                  transactions={transactions}
                  onDelete={handleDeleteTransaction}
                />
              </div>
              
              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <DollarSign className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Add your first transaction using the form to start tracking your finances
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Stats */}
      <footer className="mt-8 border-t bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>Total Transactions: {transactions.length}</p>
            <p>Income/Expense Ratio: {(totalIncome > 0 ? (totalExpense / totalIncome * 100).toFixed(1) : 0)}%</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}