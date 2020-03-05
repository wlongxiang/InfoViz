#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Feb 16 10:59:56 2020

@author: liuchang
"""

import pandas as pd
from bokeh.plotting import figure
from bokeh.io import show
import numpy as np
from bokeh.palettes import RdYlBu11 as palette
from bokeh.models import LogColorMapper
from bokeh.models import Range1d

postcode_geo_full = pd.read_csv('NL_full.txt', sep="\t", header=None)
postcode_geo = postcode_geo_full.drop(columns=[0,2,3,4,5,6,7,8,11]).copy()
postcode_geo.columns = ['Zipcode', 'Latitude', 'Longitude']
postcode_geo['Zipcode'] = postcode_geo['Zipcode'].str.replace(' ', '')
postcode_geo_to = postcode_geo.copy()
postcode_geo_to.columns = ['zipcode_to', 'Latitude_to', 'Longitude_to']
postcode_geo_from = postcode_geo.copy()
postcode_geo_from.columns = ['zipcode_from', 'Latitude_from', 'Longitude_from']

def read_data(year, p_type):
    powers = []
    names = ['enexis_{}_0101{}.csv'.format(p_type, year), 'liander_{}_0101{}.csv'.format(p_type, year), 'stedin_{}_{}.csv'.format(p_type, year)]
    for name in names:
        power_full = pd.read_csv(name)
        power = power_full.drop(columns=['net_manager','delivery_perc','num_connections','perc_of_active_connections','type_conn_perc','type_of_connection']).copy()
        power = power.merge(postcode_geo_from, how='left', on='zipcode_from')
        power = power.merge(postcode_geo_to, how='left', on='zipcode_to')
        power['Latitude'] = (power['Latitude_to'] + power['Latitude_from']) / 2
        power['Longitude'] = (power['Longitude_to'] + power['Longitude_from']) / 2
        powers.append(power)
    return pd.concat(powers)

p = figure(plot_height = 600, plot_width = 740 + 30,x_range=Range1d(3.7, 7.4), y_range=Range1d(50.6, 53.6))
power = read_data('2010', 'electricity')

step = 0.03
to_bin = lambda x: np.floor(x / step) * step
power['latbin'] = power.Latitude.map(to_bin)
power['lonbin'] = power.Longitude.map(to_bin)
groups = power.groupby(['latbin', 'lonbin']).sum().reset_index()
color_mapper = LogColorMapper(palette=palette)
p.square(x='lonbin', y='latbin', source=groups, size=4, color={'field': 'annual_consume', 'transform': color_mapper})
show(p)