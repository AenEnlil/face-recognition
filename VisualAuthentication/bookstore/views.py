from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import BookSerializer, CommentSerializer
from .models import Book


class BookViewSet(ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = Book.objects.all()

    @staticmethod
    def filter_and_sort_queryset(kwargs, queryset):
        if 'title' in kwargs:
            queryset = queryset.filter(title__in=kwargs.get('title'))
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_and_sort_queryset(request.query_params, self.queryset)
        serializer = BookSerializer(queryset, many=True)
        return Response(serializer.data, 200)

    def add_comment(self, request, *args, **kwargs):
        data = request.data
        data.update({'author': request.user})
        serializer = CommentSerializer(data=data)
        serializer.is_valid()
        serializer.save()
        return Response(serializer.data, 201)
