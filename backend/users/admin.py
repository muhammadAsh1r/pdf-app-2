from django.contrib import admin
from django.contrib.auth.models import User

try:
    admin.site.unregister(User)
except Exception:
    pass

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_active", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    list_filter = ("is_staff", "is_superuser", "is_active")
    ordering = ("id",)
