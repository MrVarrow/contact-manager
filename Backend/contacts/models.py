from django.db import models

# Create your models here.
class ContactsStatusChoices(models.Model):
    name = models.CharField(max_length=50)

    # Define status choices
    @classmethod
    def populate_defaults(cls):
        statuses = [
            'New',
            'Inactive',
            'Interested',
            'Outdated',
            'Waiting for Response',
            'Not Interested',
        ]
        for status in statuses:
            cls.objects.get_or_create(name=status)


    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Contact Status Choices"

class Contact(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=13, unique=True)
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=100)
    favorite = models.BooleanField(default=False)
    status = models.ForeignKey(ContactsStatusChoices, on_delete=models.SET_NULL, null=True)
    add_contact_date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.first_name} {self.last_name}"