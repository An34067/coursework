from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout

from .models import *
from .serializers import *


@method_decorator(csrf_exempt, name='dispatch')
class AuthorListView(APIView):
    def get(self, request):
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)
        return Response({'data': serializer.data})

    def post(self, request):
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class AuthorDetailView(APIView):
    def get(self, request, pk):
        author = get_object_or_404(Author, pk=pk)
        serializer = AuthorSerializer(author)
        return Response({'data': serializer.data})

    def put(self, request, pk):
        author = get_object_or_404(Author, pk=pk)
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def patch(self, request, pk):
        author = get_object_or_404(Author, pk=pk)
        serializer = AuthorSerializer(author, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def delete(self, request, pk):
        author = get_object_or_404(Author, pk=pk)
        author.delete()
        return Response({'status': 'deleted'})


@method_decorator(csrf_exempt, name='dispatch')
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response({'data': serializer.data})

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class CategoryDetailView(APIView):
    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category)
        return Response({'data': serializer.data})

    def put(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def patch(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def delete(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        return Response({'status': 'deleted'})


@method_decorator(csrf_exempt, name='dispatch')
class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all().select_related("category").prefetch_related("authors")
    
        category_id = request.query_params.get('category')
        author_id = request.query_params.get('author')
        status_param = request.query_params.get('status')
        search = request.query_params.get('search')

        if category_id:
            books = books.filter(category_id=category_id)
        if author_id:
            books = books.filter(authors__id=author_id)
        if status_param:
            books = books.filter(status=status_param)
        if search:
            books = books.filter(title__icontains=search)

        serializer = BookSerializer(books, many=True)
        return Response({'data': serializer.data})

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class BookDetailView(APIView):
    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book)
        return Response({'data': serializer.data})

    def put(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def patch(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return Response({'status': 'deleted'})

@method_decorator(csrf_exempt, name='dispatch')
class BookReviewsView(APIView):
    def get(self, request, book_pk):
        book = get_object_or_404(Book, pk=book_pk)
        reviews = book.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response({'data': serializer.data})

    def post(self, request, book_pk):
        if not request.user.is_authenticated:
            return Response({'status': 'error', 'message': 'Сначала войдите в систему!'}, status=401)
        book = get_object_or_404(Book, pk=book_pk)
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(book=book, user=request.user) 
            return self.get(request, book_pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ReviewListView(APIView):
    def get(self, request):
        reviews = Review.objects.all().select_related('user', 'book')
        serializer = ReviewSerializer(reviews, many=True)
        return Response({'data': serializer.data})

@method_decorator(csrf_exempt, name='dispatch')
class ReviewDetailView(APIView):
    def get(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewSerializer(review)
        return Response({'data': serializer.data})

    def put(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def patch(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return self.get(request, pk)
        return Response({'status': 'error', 'code': 400, 'errors': serializer.errors}, status=400)

    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        review.delete()
        return Response({'status': 'deleted'})

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'status': 'ok', 'user_id': user.id, 'username': user.username})
        return Response({'status': 'error', 'message': 'Неверный логин или пароль'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'status': 'ok'})


@method_decorator(csrf_exempt, name='dispatch')
class CurrentUserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'id': request.user.id, 'username': request.user.username})
        return Response({'status': 'guest'})


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'status': 'error', 'message': 'Введите логин и пароль'}, status=400)
            
        if User.objects.filter(username=username).exists():
            return Response({'status': 'error', 'message': 'Такой пользователь уже есть'}, status=400)
            
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return Response({'status': 'ok', 'user_id': user.id, 'username': user.username})

@method_decorator(csrf_exempt, name='dispatch')
class UserBookStatusListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=401)
        statuses = UserBookStatus.objects.filter(user=request.user)
        serializer = UserBookStatusSerializer(statuses, many=True)
        return Response({'data': serializer.data})

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=401)
        
        serializer = UserBookStatusSerializer(data=request.data)
        if serializer.is_valid():
            # Если книга уже есть в библиотеке, обновляем статус, иначе создаем
            UserBookStatus.objects.update_or_create(
                user=request.user, 
                book=serializer.validated_data['book'],
                defaults={'status': serializer.validated_data['status']}
            )
            return Response({'status': 'ok'})
        return Response(serializer.errors, status=400)

# --- ГЛАВЫ ---
@method_decorator(csrf_exempt, name='dispatch')
class BookChaptersView(APIView):
    def get(self, request, book_pk):
        chapters = Chapter.objects.filter(book_id=book_pk)
        # Используем ChapterSerializer, чтобы отдать текст главы (content)
        serializer = ChapterSerializer(chapters, many=True)
        return Response({'data': serializer.data})

    def post(self, request, book_pk):
        if not request.user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=401)
        serializer = ChapterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(book_id=book_pk)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ChapterDetailView(APIView):
    def get(self, request, pk):
        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(chapter)
        return Response({'data': serializer.data})