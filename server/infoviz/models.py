# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    last_name = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    action_flag = models.PositiveSmallIntegerField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Gemeente(models.Model):
    gemeente = models.TextField(db_column='Gemeente', blank=True, null=True)  # Field name made lowercase.
    gemiddeldeverkoopprijs = models.TextField(db_column='Gemiddeldeverkoopprijs', blank=True, null=True)  # Field name made lowercase.
    gemeentecode = models.IntegerField(db_column='Gemeentecode', blank=True, null=True)  # Field name made lowercase.
    gemeentenaam = models.TextField(db_column='Gemeentenaam', blank=True, null=True)  # Field name made lowercase.
    provinciecode = models.IntegerField(db_column='Provinciecode', blank=True, null=True)  # Field name made lowercase.
    provincienaam = models.TextField(db_column='Provincienaam', blank=True, null=True)  # Field name made lowercase.
    id = models.AutoField(unique=True, blank=True, null=False, primary_key=True)

    class Meta:
        managed = True
        db_table = 'gemeente'


class Summary(models.Model):
    id = models.AutoField(unique=True, blank=True, null=False, primary_key=True)
    province = models.TextField(blank=True, null=True)
    electricity = models.IntegerField(blank=True, null=True)
    gas = models.IntegerField(blank=True, null=True)
    totaalmannenenvrouwen = models.IntegerField(db_column='Totaalmannenenvrouwen', blank=True, null=True)  # Field name made lowercase.
    number_0tot5jaar = models.IntegerField(db_column='0tot5jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_5tot10jaar = models.IntegerField(db_column='5tot10jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_10tot15jaar = models.IntegerField(db_column='10tot15jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_15tot20jaar = models.IntegerField(db_column='15tot20jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_20tot25jaar = models.IntegerField(db_column='20tot25jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_25tot30jaar = models.IntegerField(db_column='25tot30jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_30tot35jaar = models.IntegerField(db_column='30tot35jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_35tot40jaar = models.IntegerField(db_column='35tot40jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_40tot45jaar = models.IntegerField(db_column='40tot45jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_45tot50jaar = models.IntegerField(db_column='45tot50jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_50tot55jaar = models.IntegerField(db_column='50tot55jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_55tot60jaar = models.IntegerField(db_column='55tot60jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_60tot65jaar = models.IntegerField(db_column='60tot65jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_65tot70jaar = models.IntegerField(db_column='65tot70jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_70tot75jaar = models.IntegerField(db_column='70tot75jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_75tot80jaar = models.IntegerField(db_column='75tot80jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_80tot85jaar = models.IntegerField(db_column='80tot85jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_85tot90jaar = models.IntegerField(db_column='85tot90jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_90tot95jaar = models.IntegerField(db_column='90tot95jaar', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    number_95jaarofouder = models.IntegerField(db_column='95jaarofouder', blank=True, null=True)  # Field renamed because it wasn't a valid Python identifier.
    totaalmannen = models.IntegerField(db_column='Totaalmannen', blank=True, null=True)  # Field name made lowercase.
    number_0tot5jaar_1 = models.IntegerField(db_column='0tot5jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_5tot10jaar_1 = models.IntegerField(db_column='5tot10jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_10tot15jaar_1 = models.IntegerField(db_column='10tot15jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_15tot20jaar_1 = models.IntegerField(db_column='15tot20jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_20tot25jaar_1 = models.IntegerField(db_column='20tot25jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_25tot30jaar_1 = models.IntegerField(db_column='25tot30jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_30tot35jaar_1 = models.IntegerField(db_column='30tot35jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_35tot40jaar_1 = models.IntegerField(db_column='35tot40jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_40tot45jaar_1 = models.IntegerField(db_column='40tot45jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_45tot50jaar_1 = models.IntegerField(db_column='45tot50jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_50tot55jaar_1 = models.IntegerField(db_column='50tot55jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_55tot60jaar_1 = models.IntegerField(db_column='55tot60jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_60tot65jaar_1 = models.IntegerField(db_column='60tot65jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_65tot70jaar_1 = models.IntegerField(db_column='65tot70jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_70tot75jaar_1 = models.IntegerField(db_column='70tot75jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_75tot80jaar_1 = models.IntegerField(db_column='75tot80jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_80tot85jaar_1 = models.IntegerField(db_column='80tot85jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_85tot90jaar_1 = models.IntegerField(db_column='85tot90jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_90tot95jaar_1 = models.IntegerField(db_column='90tot95jaar.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_95jaarofouder_1 = models.IntegerField(db_column='95jaarofouder.1', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    totaalvrouwen = models.IntegerField(db_column='Totaalvrouwen', blank=True, null=True)  # Field name made lowercase.
    number_0tot5jaar_2 = models.IntegerField(db_column='0tot5jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_5tot10jaar_2 = models.IntegerField(db_column='5tot10jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_10tot15jaar_2 = models.IntegerField(db_column='10tot15jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_15tot20jaar_2 = models.IntegerField(db_column='15tot20jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_20tot25jaar_2 = models.IntegerField(db_column='20tot25jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_25tot30jaar_2 = models.IntegerField(db_column='25tot30jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_30tot35jaar_2 = models.IntegerField(db_column='30tot35jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_35tot40jaar_2 = models.IntegerField(db_column='35tot40jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_40tot45jaar_2 = models.IntegerField(db_column='40tot45jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_45tot50jaar_2 = models.IntegerField(db_column='45tot50jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_50tot55jaar_2 = models.IntegerField(db_column='50tot55jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_55tot60jaar_2 = models.IntegerField(db_column='55tot60jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_60tot65jaar_2 = models.IntegerField(db_column='60tot65jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_65tot70jaar_2 = models.IntegerField(db_column='65tot70jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_70tot75jaar_2 = models.IntegerField(db_column='70tot75jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_75tot80jaar_2 = models.IntegerField(db_column='75tot80jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_80tot85jaar_2 = models.IntegerField(db_column='80tot85jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_85tot90jaar_2 = models.IntegerField(db_column='85tot90jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_90tot95jaar_2 = models.IntegerField(db_column='90tot95jaar.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    number_95jaarofouder_2 = models.IntegerField(db_column='95jaarofouder.2', blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it wasn't a valid Python identifier.
    totaalpersonenmetmigratieachtergrond = models.IntegerField(db_column='Totaalpersonenmetmigratieachtergrond', blank=True, null=True)  # Field name made lowercase.
    personenmeteenwestersemigratieachtergrond = models.IntegerField(db_column='Personenmeteenwestersemigratieachtergrond', blank=True, null=True)  # Field name made lowercase.
    personenmeteenniet_westersemigratieachtergrond = models.IntegerField(db_column='Personenmeteenniet-westersemigratieachtergrond', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    totaalparticulierehuishoudens = models.IntegerField(db_column='Totaalparticulierehuishoudens', blank=True, null=True)  # Field name made lowercase.
    eenpersoonshuishoudens = models.IntegerField(db_column='Eenpersoonshuishoudens', blank=True, null=True)  # Field name made lowercase.
    meerpersoonshuishoudenszonderkinderen = models.IntegerField(db_column='Meerpersoonshuishoudenszonderkinderen', blank=True, null=True)  # Field name made lowercase.
    meerpersoonshuishoudensmetkinderen = models.IntegerField(db_column='Meerpersoonshuishoudensmetkinderen', blank=True, null=True)  # Field name made lowercase.
    gemiddeldehuishoudensgrootte = models.FloatField(db_column='Gemiddeldehuishoudensgrootte', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'summary'
