from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import Summary
import json


def index(request):
    return HttpResponse("Hello, world. Index Page.")

def energy_summary(request, energy_type):
    atest_question_list = Summary.objects.all()
    resp = {q.province : getattr(q, energy_type) for q in atest_question_list}
    return HttpResponse(json.dumps(resp), content_type="application/json")
