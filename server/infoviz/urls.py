#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Mar  1 14:06:04 2020

@author: liuchang
"""

from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
        # ex: /infoviz/summary/gas,
    path('summary/<str:rtype>/', views.summary),

    path('gemeenten/<str:gemeenten>/<str:rtype>', views.gemeenten_detail),

    path('summary_main/<str:rtype>', views.summary_main),

    path('province_main/<str:province>', views.province_main),

    path('summary_pop/<str:province>', views.summary_pop),

    path('province_pop/<str:province>/<str:gemeenten>', views.province_pop)

]