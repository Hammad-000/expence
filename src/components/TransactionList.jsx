export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list-card">
        <h2>Transactions</h2>
        <p className="empty-message">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB - dateA;
  });

  return (
    <div className="transaction-list-card">
      <h2>Transactions</h2>
      <div className="transaction-list">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-info">
              <div className="transaction-main">
                <h3>{transaction.description}</h3>
                <span className="transaction-category">{transaction.category}</span>
              </div>
              <div className="transaction-meta">
                <span className="transaction-date">
                  {transaction.createdAt?.toDate
                    ? transaction.createdAt.toDate().toLocaleDateString()
                    : new Date(transaction.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`transaction-amount ${transaction.type}`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(transaction.id)}
              className="btn-delete"
              title="Delete transaction"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}