# backend/users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password], min_length=8)
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password", "password2")
        extra_kwargs = {"email": {"required": False}}

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2", None)
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """Used for profile GET/PUT"""
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password], min_length=8)

    def validate_old_password(self, value):
        request = self.context.get("request")
        if request is None:
            raise serializers.ValidationError("Request is required in serializer context.")
        user = request.user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def validate(self, attrs):
        if attrs["old_password"] == attrs["new_password"]:
            raise serializers.ValidationError({"new_password": "New password must be different from old password."})
        return attrs

    def save(self, **kwargs):
        request = self.context.get("request")
        user = request.user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
