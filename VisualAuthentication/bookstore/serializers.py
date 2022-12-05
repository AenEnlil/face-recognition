from rest_framework.serializers import ModelSerializer
from rest_framework import fields

from .models import Book, Comment, Author, Category


class AuthorSerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = Author


class CategorySerializer(ModelSerializer):
    class Meta:
        fields = ['name']
        model = Category


class CommentSerializer(ModelSerializer):

    class Meta:
        fields = '__all__'
        model = Comment


class BookSerializer(ModelSerializer):
    authors = AuthorSerializer(many=True)
    categories = CategorySerializer(many=True)

    class Meta:
        fields = ['title', 'authors', 'categories', 'cover', 'price', 'printed_year']
        model = Book
