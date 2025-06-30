from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    CustomTokenObtainPairView,
    RegisterView,
    CurrentUserView,
    GoogleLoginView
)
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'DJAPI'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]
