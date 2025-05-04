from rest_framework import serializers
from .models import Contact, ContactsStatusChoices

class ContactReadSerializer(serializers.ModelSerializer):
    status = serializers.SlugRelatedField(read_only=True, slug_field='name')
    add_contact_date = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'city', 'status', 'add_contact_date']

class ContactWriteSerializer(serializers.ModelSerializer):
    status = serializers.SlugRelatedField(queryset=ContactsStatusChoices.objects.all(), slug_field='name')
    add_contact_date = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta:
        model = Contact
        fields = '__all__'

class ContactsDisplaySerializer(serializers.ModelSerializer):
    status = serializers.SlugRelatedField(queryset=ContactsStatusChoices.objects.all(), slug_field='name')
    add_contact_date = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Contact
        fields = '__all__'

class ContactsStatusChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactsStatusChoices
        fields = '__all__'
