# Generated by Django 3.0.1 on 2020-01-08 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comics', '0031_auto_20191231_0131'),
    ]

    operations = [
        migrations.AddField(
            model_name='comic',
            name='error_404_image',
            field=models.ImageField(blank=True, help_text='A square PNG to be used as a 404 message. Ideally 1000x1000px.', upload_to=''),
        ),
        migrations.AddField(
            model_name='comic',
            name='error_500_image',
            field=models.ImageField(blank=True, help_text='A square PNG to be used as a 500 message. Ideally 1000x1000px.', upload_to=''),
        ),
    ]