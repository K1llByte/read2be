from flask import Flask
from flask_restful import Resource, Api
from read2be import Read2Be
from recommender import ContentFiltering
from collab_recommender import CollaborativeFiltering
import threading

app = Flask(__name__)
api = Api(app)
db = Read2Be()


class RecommenderByBook(Resource):
    recommender = ContentFiltering()

    def get(self, isbn):
        books = list(db.get_books())
        # Check if isbn of target book doesn't exist on database
        if not any(filter(lambda b: b["isbn"] == isbn ,books)):
            return { "error": f"ISBN '{isbn}' doesn't exist" } , 404

        # Check if model is already trained
        if not self.recommender.is_trained():
            return { 'error': "Model isn't trained yet" }, 500

        # Get book recommendations
        predictions = self.recommender.predict(isbn)
        return {'recommendations': list(predictions) }

class RecommenderByUser(Resource):
    recommender = CollaborativeFiltering()

    def get(self, username):

        # Check if model is already trained
        if not self.recommender.is_trained():
            return { 'error': "Model isn't trained yet" }, 500

        # Get book recommendations
        try:
            predictions = self.recommender.predict(username)
            
            return { 'recommendations': list(db.get_books_by_isbn(predictions)) }
        except Exception as e:
            return { 'error': str(e) }, 400


################### Training process ###################

def train_by_book():
    books = list(db.get_books())
    print("[1]","Training ContentFiltering model ...")
    RecommenderByBook.recommender.fit(books)
    print("[1]","Finished Training")

def train_by_user():
    users = list(db.get_users())
    print("[2]","Training CollaborativeFiltering model ...")
    RecommenderByUser.recommender.fit(users)
    print("[2]","Finished Training")

# Train by book model Thread
train_b_thread = threading.Thread(target=train_by_book)
# Train by user model Thread
train_u_thread = threading.Thread(target=train_by_user)

train_b_thread.start()
train_u_thread.start()

########################################################


api.add_resource(RecommenderByBook, '/recommender/book/<string:isbn>')
api.add_resource(RecommenderByUser, '/recommender/user/<string:username>')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port="5000",debug=False) 