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
        # ex: /infoviz/summary/gas
    path('summary/<str:energy_type>/', views.energy_summary, name='energy_summary')
]