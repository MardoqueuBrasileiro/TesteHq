# Generated by Django 3.2.7 on 2021-09-10 22:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('comics', '0045_auto_20201116_2039'),
    ]

    operations = [
        migrations.CreateModel(
            name='CodeSnippets',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Human-readable name for this injected code.', max_length=32)),
                ('active', models.BooleanField(default=True, help_text='Disable this to remove the injected code from the page.')),
                ('code', models.TextField(blank=True, help_text="The HTML code that is injected into the page just before the end body tag. BE CAREFUL -- this code can break your site if you don't know what you are doing!")),
                ('comic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='code_snippets', to='comics.comic')),
            ],
        ),
    ]
