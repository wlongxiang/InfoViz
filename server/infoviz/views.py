from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import Summary
from .models import Gemeente
import json
import pandas as pd
from django.db.models import Q
import numpy as np

def index(request):
    return HttpResponse("Hello, world. Index Page.")

def summary(request, rtype):
    atest_question_list = Summary.objects.all()
    resp = {q.province : getattr(q, rtype) for q in atest_question_list}
    return HttpResponse(json.dumps(resp), content_type="application/json")

def gemeenten_detail(request, gemeenten, rtype):
    atest_question_list = Gemeente.objects.filter(province=gemeenten)
    resp = {q.gemeentenaam : getattr(q, rtype) for q in atest_question_list}
    return HttpResponse(json.dumps(resp), content_type="application/json")

def summary_main(request, rtype):
    atest_question_list = Summary.objects.all()
    resp = {q.province : [getattr(q, 'gas'), getattr(q, 'electricity'), getattr(q, 'totaalmannenenvrouwen'), getattr(q, 'housing_price'), q.province] for q in atest_question_list}
    return HttpResponse(json.dumps(resp), content_type="application/json")

def province_main(request, province):
    atest_question_list = Gemeente.objects.filter(province=province)
    resp = {q.gemeentenaam : [getattr(q, 'gas'), getattr(q, 'electricity'), getattr(q, 'totaalmannenenvrouwen'), getattr(q, 'housing_price'), q.gemeentenaam] for q in atest_question_list}
    return HttpResponse(json.dumps(resp), content_type="application/json")

def summary_pop(request, province):
    p_data = Summary.objects.filter(province=province)
    other = Summary.objects.filter(~Q(province=province))
    df = pd.DataFrame(list(other.values()))[['gas', 'electricity', 'totaalmannenenvrouwen', 'housing_price', 'transport']]
    resp = {'province' : [-getattr(q, 'transport'), -getattr(q, 'housing_price'), -getattr(q, 'totaalmannenenvrouwen'), -getattr(q, 'electricity'), -getattr(q, 'gas')] for q in p_data}
    resp['mean'] = list(df.mean()[['transport','housing_price','totaalmannenenvrouwen', 'electricity','gas']])
    resp['min'] = list(df.min()[['transport','housing_price','totaalmannenenvrouwen', 'electricity','gas']])
    resp['max'] = list(df.max()[['transport','housing_price','totaalmannenenvrouwen', 'electricity','gas']])
    resp['province_r'] = list(np.divide(resp['province'], resp['max']))
    resp['mean_r'] = list(np.divide(resp['mean'], resp['max']))
    resp['min_r'] = list(np.divide(resp['min'], resp['max']))
    resp['max_r'] = [1] * len(resp['min_r'])
    return HttpResponse(json.dumps(resp), content_type="application/json")

def province_pop(request, province, gemeenten):
    p_data = Gemeente.objects.filter(province=province).filter(gemeentenaam=gemeenten)
    other = Gemeente.objects.filter(province=province).filter(~Q(gemeentenaam=gemeenten))
    df = pd.DataFrame(list(other.values()))[['gas', 'electricity', 'totaalmannenenvrouwen', 'housing_price', 'transport']]
    resp = {'province' : [-getattr(q, 'transport'), -getattr(q, 'housing_price'), -getattr(q, 'totaalmannenenvrouwen'), -getattr(q, 'electricity'), -getattr(q, 'gas')] for q in p_data}
    resp['mean'] = list(df.mean()[['transport','housing_price','totaalmannenenvrouwen', 'electricity','gas']])
    resp['min'] = list(df.min()[['transport','housing_price','totaalmannenenvrouwen', 'electricity','gas']])
    resp['max'] = list(df.max()[['transport','housing_price','totaalmannenenvrouwen', 'electricity','gas']])
    resp['province_r'] = list(np.divide(resp['province'], resp['max']))
    resp['mean_r'] = list(np.divide(resp['mean'], resp['max']))
    resp['min_r'] = list(np.divide(resp['min'], resp['max']))
    resp['max_r'] = [1] * len(resp['min_r'])
    return HttpResponse(json.dumps(resp), content_type="application/json")


def comparison(request):
	return ''