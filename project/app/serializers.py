from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Author, Category, Book, Chapter, Review, UserBookStatus


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "full_name", "bio", "photo_url", "birth_date"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ChapterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "number", "title"]


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "book", "number", "title", "content"]
        read_only_fields = ["book"]


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "user", "book", "rating", "text", "created_at", "updated_at"]
        read_only_fields = ["user", "book", "created_at", "updated_at"]


class BookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    author_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Author.objects.all(), source="authors"
    )

    class Meta:
        model = Book
        fields = [
            "id", "title", "description", "cover_url", "language", "status",
            "category", "authors", "author_ids", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class UserBookStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBookStatus
        fields = ["id", "user", "book", "status", "current_chapter", "percent", "updated_at"]
        read_only_fields = ["user", "updated_at"]