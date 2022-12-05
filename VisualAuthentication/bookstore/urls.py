from django.urls import path
from .views import BookViewSet

urlpatterns = [
    path('', BookViewSet.as_view({'get': 'list'})),
    path('<int:book_id>/', BookViewSet.as_view({'get': 'retrieve'})),
    path('add-comment', BookViewSet.as_view({'post': 'add_comment'})),
]
