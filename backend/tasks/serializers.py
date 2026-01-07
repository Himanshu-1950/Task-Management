from rest_framework import serializers
from .models import Task, Category, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color', 'created_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status', 'due_date',
            'assigned_to', 'created_by', 'category', 'tags', 'category_id', 'tag_ids',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'assigned_to']

    def create(self, validated_data):
        category_id = validated_data.pop('category_id', None)
        tag_ids = validated_data.pop('tag_ids', [])
        validated_data['created_by'] = self.context['request'].user
        validated_data['assigned_to'] = self.context['request'].user

        task = Task.objects.create(**validated_data)

        if category_id:
            task.category_id = category_id
            task.save()

        if tag_ids:
            task.tags.set(tag_ids)

        return task

    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        tag_ids = validated_data.pop('tag_ids', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if category_id is not None:
            instance.category_id = category_id

        instance.save()

        if tag_ids:
            instance.tags.set(tag_ids)

        return instance
