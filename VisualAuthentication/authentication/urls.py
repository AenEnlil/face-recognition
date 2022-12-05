
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LogoutView, RegisterView, ProfileView, VisualAuthentication, AuthenticationViewSet

urlpatterns = [
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh_token'),
    path('login/', AuthenticationViewSet.as_view({'post': 'login'}), name='login'),
    path('visual-authentication/', VisualAuthentication.as_view(), name='visual_auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
