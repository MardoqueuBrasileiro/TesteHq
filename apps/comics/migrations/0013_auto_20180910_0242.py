# Generated by Django 2.1.1 on 2018-09-10 02:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('comics', '0012_auto_20180826_2150'),
    ]

    operations = [
        migrations.AddField(
            model_name='page',
            name='posted_at',
            field=models.DateTimeField(default=django.utils.timezone.now, help_text="If this is in the future, it won't be visible until that time"),
        ),
    ]