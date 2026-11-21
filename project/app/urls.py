from django.urls import path
from app import views
from .views import *

urlpatterns = [
    path('authors/', views.AuthorListView.as_view()),
    path('authors/<int:pk>/',views.AuthorDetailView.as_view()),
    path('books/', views.BookListView.as_view()),
    path('books/<int:pk>/',views.BookDetailView.as_view()),
    path('categories/', views.CategoryListView.as_view()),
    path('categories/<int:pk>/',views.CategoryDetailView.as_view()),
    path('books/<int:book_pk>/reviews/', views.BookReviewsView.as_view()),
    path('reviews/', views.ReviewListView.as_view()),
    path('reviews/<int:pk>/',views.ReviewDetailView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('current-user/', views.CurrentUserView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('library/', views.UserBookStatusListView.as_view()),
    path('books/<int:book_pk>/chapters/', views.BookChaptersView.as_view()),
    path('chapters/<int:pk>/', views.ChapterDetailView.as_view()),
    
] 