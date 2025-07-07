from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    CustomTokenObtainPairView,
    RegisterView,
    CurrentUserView,
    GoogleLoginView
)
from .views import CsrfExemptPasswordResetView
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import views as auth_views
from .views import custom_token_generator
from . import views

#app_name = 'DJAPI'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('category/<slug:category_slug>/', views.products_by_category, name='products_by_category'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('auth/password-reset/', CsrfExemptPasswordResetView.as_view(), name='password_reset'),
    path('auth/password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('auth/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(token_generator=custom_token_generator
), name='password_reset_confirm'),
    path('auth/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
