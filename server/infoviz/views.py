from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import Summary
from .models import Gemeente
import json


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


def comparison(request):
	return ''