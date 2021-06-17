from pymongo import MongoClient
from pprint import pprint

class Read2Be:
    client = None
    db = None

    def __init__(self):
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client['read2be']

    def get_books(self):
        books = self.db['books']
        return books.find()

    def get_users(self):
        users = self.db['users']
        return users.find({}, { '_id':0, 'username':1, 'books':1, })