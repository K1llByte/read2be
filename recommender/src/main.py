from flask import Flask
from flask_restful import Resource, Api
from read2be import Read2Be
from recommender import ContentFiltering

app = Flask(__name__)
api = Api(app)
db = Read2Be()

class Recommender(Resource):
    recommender = ContentFiltering()
    def get(self,isbn):
        books = list(db.get_books())
        
        # Check if isbn of target book doesn't exist on database
        if not any(filter(lambda b: b["isbn"] == isbn ,books)):
            return { "error": f"ISBN '{isbn}' doesn't exist" } 

        # Train model if it isn't already
        if not self.recommender.is_trained():
            self.recommender.fit(books)

        # Get book recommendations
        predictions = self.recommender.predict(isbn)
        return {'recommendations': list(predictions) }

api.add_resource(Recommender, '/recommender/<string:isbn>')

if __name__ == '__main__':
    app.run(host='127.0.0.1',port="5000",debug=True)