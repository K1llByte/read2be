#!/usr/bin/sh

RECOMMENDER_VENV="recomender_env"

create_env()
{
    python -m venv $RECOMMENDER_VENV
    # Source environment with isolated dependencies
    source $RECOMMENDER_VENV/bin/activate
    pip install -r requirements.txt
}

start()
{
    # Create virtual environment if folder doesn't exist
    if [ ! -d $RECOMMENDER_VENV ]; then
        create_env
    else
        # Source environment with isolated dependencies
        source $RECOMMENDER_VENV/bin/activate
    fi

    # Execute
    python src/main.py
}

case $1 in
    ""|"start")
        start
    ;;
    "env")
        create_env
    ;;
    *)
        >&2 echo "error: Unkown argument '$1'"
    ;;
esac