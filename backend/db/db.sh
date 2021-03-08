#!/bin/bash

IMPORT_FOLDER="importdata"
EXPORT_FOLDER="exportdata"

usage()
{
    echo "Usage: $0 [OPTION] <[COLLECTION]>"
    echo "Import or Export read2be MongoDB database collections."
    echo "  -i              import one collection by name"
    echo "  -e              export one collection by name"
    echo "  -I, --import    import all collection"
    echo "  -E, --export    export all collection"
    echo "  -O, --override  copies files from EXPORT_FOLDER"
    echo "                  to IMPORT_FOLDER"
    exit 1

    echo "Usage: $0 [import|export]"
}

############ AUX DEFENITIONS ############

delete_aux()
{
    if [ -z "$1" ]; then
        >&2 echo "error: 'delete_aux' was not provided with argument"
        exit 1
    fi
    mongo read2be --eval "db.$1.drop()"
}

import_aux()
{
    if [ -z "$1" ]; then
        >&2 echo "error: 'import_aux' was not provided with argument"
        exit 1
    fi
    mongoimport --jsonArray -d read2be -c $1 $IMPORT_FOLDER/$1.json
}

export_aux()
{
    if [ -z "$1" ]; then
        >&2 echo "error: 'export_aux' was not provided with argument"
        exit 1
    fi
    mongoexport --pretty --jsonArray -d read2be -c $1 -o $EXPORT_FOLDER/$1.json
}

is_allowed()
{
    local e match="$1"
    shift
    for e; do [[ "$e" == "$match" ]] && return 0; done
    return 1
}

#########################################

import_db()
{
    array=("authors" "books" "publishers" "users" "genres" "languages" "status")

    is_allowed $1 "${array[@]}" &&    \
    delete_aux $1 && import_aux $1 || \
    echo "error: collection name is not valid"
}

export_db()
{
    array=("authors" "books" "publishers" "users" "genres" "languages" "status")
    
    is_allowed $1 "${array[@]}" &&    \
    export_aux $1 || \
    echo "error: collection name is not valid"
}

import_all_db()
{
    delete_aux authors    && import_aux authors
    delete_aux books      && import_aux books
    delete_aux publishers && import_aux publishers
    delete_aux users      && import_aux users

    delete_aux genres    && import_aux genres
    delete_aux languages && import_aux languages
    delete_aux status    && import_aux status
}

export_all_db()
{
    export_aux authors
    export_aux books
    export_aux publishers
    export_aux users

    export_aux genres
    export_aux languages
    export_aux status
}

override()
{
    #array=("authors" "books" "publishers" "users" "genres" "languages" "status")

    cp -f $EXPORT_FOLDER/*.json $IMPORT_FOLDER/
}

############ Main execution #############

case "$1" in

"--help" | "")
    usage
;;


"-i")
    import_db $2
;;

"-e")
    export_db $2
;;

"-I"|"--import-all")
    import_all_db
;;

"-E"|"--export-all")
    export_all_db
;;

"-O"|"--override")
    override
;;

*)
    >&2 echo "error: Invalid argument"
    exit 1
;;
    
esac
exit 0