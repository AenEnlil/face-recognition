
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AuthenticationViewSet, UserViewSet

urlpatterns = [
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh_token'),
    path('login/', AuthenticationViewSet.as_view({'post': 'login'}), name='login'),
    path('visual-authentication/', AuthenticationViewSet.as_view({'post': 'authenticate_face'}), name='visual_auth'),
    path('logout/', AuthenticationViewSet.as_view({'get': 'logout'}), name='logout'),
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('profile/', UserViewSet.as_view({'get': 'retrieve', 'patch': 'update'}), name='profile'),
]
