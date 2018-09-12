# Generated by Django 2.1.1 on 2018-09-10 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comics', '0014_comic_post_border_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='comic',
            name='discord_link',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='comic',
            name='instagram_link',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='comic',
            name='patreon_link',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='comic',
            name='reddit_link',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='comic',
            name='twitter_link',
            field=models.URLField(blank=True),
        ),
    ]
