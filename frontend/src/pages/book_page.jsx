import { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar, FaRegStar, FaBookOpen, FaBookmark } from 'react-icons/fa';

export default function BookPage({ book, user, setPage, setSelectedAuthor, setSelectedBook }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  
  const [currentStatus, setCurrentStatus] = useState(''); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loadReviews = () => {
    if (!book) return;
    fetch(`/api/books/${book.id}/reviews/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setReviews(data.data));
  };

  const loadStatus = () => {
    if (!user || !book) return;
    fetch('/api/library/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const found = data.data.find(item => item.book === book.id);
        if (found) setCurrentStatus(found.status);
      });
  };

  useEffect(() => {
    loadReviews();
    loadStatus();
  }, [book, user]);

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);

    if (!user) {
      setPage('auth');
      return;
    }

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    fetch('/api/library/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ book: book.id, status: newStatus }),
      credentials: 'include'
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      'want_to_read': 'Хочу прочитать',
      'reading': 'Читаю',
      'finished': 'Прочитано',
      'dropped': 'Брошено'
    };
    return labels[status] || 'В библиотеку...';
  };

  // ОТПРАВКА ОТЗЫВА (восстановлено)
  const handleSubmitReview = (e) => {
    e.preventDefault();
    setError('');
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    fetch(`/api/books/${book.id}/reviews/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ rating: Number(rating), text: text.trim() }),
      credentials: 'include'
    }).then(async (res) => {
      if (res.ok) {
        setText('');
        setRating(5);
        loadReviews();
      } else {
        const errorData = await res.json();
        setError(JSON.stringify(errorData) || 'Не удалось отправить отзыв');
      }
    }).catch((err) => setError('Ошибка сети: ' + err.message));
  };

  if (!book) return <p className="empty-msg">Загрузка...</p>;

  return (
    <div>
      <button className="btn-back" onClick={() => setPage('catalog')}>
        <FaArrowLeft /> Назад в каталог
      </button>

      <div className="detail-card">
        <img className="detail-cover" src={book.cover_url || 'https://via.placeholder.com/250x400'} alt={book.title} />
        <div className="detail-info">
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author" onClick={() => { setSelectedAuthor(book.authors[0].id); setPage('author'); }}>
            {book.authors.map(a => a.full_name).join(', ')}
          </p>
          <p className="detail-desc">{book.description || 'Описание скоро появится.'}</p>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <button 
              className="btn btn-accent" 
              onClick={() => { setSelectedBook(book.id); setPage('reader'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '16px' }}
            >
              <FaBookOpen /> Читать онлайн
            </button>

            <div className="custom-select-container">
              <button className="library-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FaBookmark />
                {getStatusLabel(currentStatus)}
                <span className="arrow">▼</span>
              </button>

              {isDropdownOpen && (
                <div className="custom-dropdown">
                  <div className={`custom-dropdown-option ${currentStatus === 'want_to_read' ? 'active' : ''}`} onClick={() => handleStatusChange('want_to_read')}>
                    Хочу прочитать
                  </div>
                  <div className={`custom-dropdown-option ${currentStatus === 'reading' ? 'active' : ''}`} onClick={() => handleStatusChange('reading')}>
                    Читаю
                  </div>
                  <div className={`custom-dropdown-option ${currentStatus === 'finished' ? 'active' : ''}`} onClick={() => handleStatusChange('finished')}>
                    Прочитано
                  </div>
                  <div className={`custom-dropdown-option ${currentStatus === 'dropped' ? 'active' : ''}`} onClick={() => handleStatusChange('dropped')}>
                    Брошено
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: 44 }}>
        Отзывы ({reviews.length})
      </h2>

      {user ? (
        <form className="review-form" onSubmit={handleSubmitReview}>
          {error && <p className="auth-error">{error}</p>}

          <label>
            Твоя оценка:
            <select value={rating} onChange={e => setRating(e.target.value)}>
              <option value="5">★★★★★ - Шедевр</option>
              <option value="4">★★★★ - Отлично</option>
              <option value="3">★★★ - Нормально</option>
              <option value="2">★★ - Не зашло</option>
              <option value="1">★ - Разочарование</option>
            </select>
          </label>

          <label>
            Твой отзыв:
            <textarea
              placeholder="Что ты почувствовал, читая эту книгу?"
              required
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </label>

          <button type="submit" className="btn btn-accent">Опубликовать отзыв</button>
        </form>
      ) : (
        <div className="login-hint">
          Войди в аккаунт, чтобы оставить отзыв.
        </div>
      )}

      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="empty-msg">Отзывов пока нет. Будь первым!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-user">{review.user.username}</span>
                <span className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  ))}
                </span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}