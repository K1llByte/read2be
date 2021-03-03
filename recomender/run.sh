#!/bin/bash
python -m venv recomender_env
pip install -r requirements.txt
source recomender_env/bin/activate
python src/main.py