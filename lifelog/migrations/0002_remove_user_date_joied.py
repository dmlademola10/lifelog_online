# Generated by Django 4.1 on 2024-02-23 08:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("lifelog", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="date_joied",
        ),
    ]