from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'password']
        read_only_fields = ['id', 'is_active', 'date_joined']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
