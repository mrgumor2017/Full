from django.contrib import admin
from .models import Category, CustomUser
from django.contrib.auth.admin import UserAdmin


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Додаткові поля', {'fields': ('phone', 'image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Додаткові поля', {'fields': ('phone', 'image')}),
    )
