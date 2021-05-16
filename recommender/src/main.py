from flask import Flask
from flask_restful import Resource, Api
from read2be import Read2Be
from recommender import ContentFiltering

app = Flask(__name__)
api = Api(app)
db = Read2Be()

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

class Recommender(Resource):
    recommender = ContentFiltering()
    def get(self,isbn):
        books = list(db.get_books())
        try:
            target_book = list(filter(lambda b : b["isbn"] == isbn, books))[0]["title"]
        except:
            return { "error": f"ISBN '{isbn}' doesn't exist" } 
        data = [ book['title'] for book in books]

        if not self.recommender.is_trained():
            self.recommender.fit(data)

        predictions = self.recommender.predict(target_book)
        return {'recommendations': list(predictions) }

api.add_resource(HelloWorld, '/')
api.add_resource(Recommender, '/recommender/<string:isbn>')

if __name__ == '__main__':
    app.run(host='127.0.0.1',port="5000",debug=True)