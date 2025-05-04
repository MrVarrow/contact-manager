from rest_framework import viewsets
from .models import Contact, ContactsStatusChoices
from .serializers import (ContactReadSerializer, ContactWriteSerializer, ContactsDisplaySerializer,
                          ContactsStatusChoicesSerializer)

# Create your views here.

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ContactReadSerializer
        return ContactWriteSerializer

# View set for displaying contacts with all information
class ContactsDisplayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactsDisplaySerializer

# View set for displaying status choices
class ContactsStatusChoicesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContactsStatusChoices.objects.all()
    serializer_class = ContactsStatusChoicesSerializer


class FavoriteContactsListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ContactsDisplaySerializer

    def get_queryset(self):
        queryset = Contact.objects.filter(favorite=True)
        return queryset

