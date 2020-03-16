from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import Summary
from .models import Gemeente
import json
import pandas as pd
from django.db.models import Q

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
    resp = {'province' : [-getattr(q, 'gas'), -getattr(q, 'electricity'), -getattr(q, 'totaalmannenenvrouwen'), -getattr(q, 'housing_price'),  -getattr(q, 'transport')] for q in p_data}
    resp['mean'] = list(df.mean()[['gas', 'electricity', 'totaalmannenenvrouwen', 'housing_price', 'transport']])
    resp['min'] = list(df.min()[['gas', 'electricity', 'totaalmannenenvrouwen', 'housing_price', 'transport']])
    resp['max'] = list(df.max()[['gas', 'electricity', 'totaalmannenenvrouwen', 'housing_price', 'transport']])
    return HttpResponse(json.dumps(resp), content_type="application/json")


def comparison(request):
	return ''