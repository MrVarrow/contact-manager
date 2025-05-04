from django.urls import include, path
from .views import ContactViewSet, ContactsDisplayViewSet, ContactsStatusChoicesViewSet, FavoriteContactsListViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('contacts', ContactViewSet, basename='contacts')
router.register('contacts-display', ContactsDisplayViewSet, basename='contacts-display')
router.register('contact-statuses', ContactsStatusChoicesViewSet, basename='contact-statuses')
router.register('favorite-contacts', FavoriteContactsListViewSet, basename='favorite-contacts')

urlpatterns = [
    path('', include(router.urls), name="contacts"),
]