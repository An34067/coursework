export default function Profile({ user, books, setSelectedBook, setPage }) {
  if (!user) return null;

  const initial = user.username.charAt(0).toUpperCase();

  // Первые 3 книги как «моя полка»
  const myBooks = books.slice(0, 3);

  return (
    <div>
      {/* Карточка пользователя */}
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <div>
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-role">Читатель сообщества «BookHub»</p>
        </div>
      </div>

      {/* Полка */}
      <h2 className="section-title">Моя полка</h2>

      {myBooks.length === 0 ? (
        <p className="empty-msg">Здесь появятся твои книги.</p>
      ) : (
        <div className="book-grid">
          {myBooks.map(book => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => { setSelectedBook(book.id); setPage('book'); }}
            >
              <img
                src={book.cover_url || 'https://via.placeholder.com/200x300?text=Нет+обложки'}
                alt={book.title}
              />
              <h3 className="book-card-title">{book.title}</h3>
              <p className="book-card-author">{book.authors.map(a => a.full_name).join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}