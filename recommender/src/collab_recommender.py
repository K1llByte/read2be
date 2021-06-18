

from  surprise import Dataset
from surprise import Reader
from surprise.model_selection import cross_validate
#from surprise import evaluate 
from surprise import KNNBasic
import pandas as pd
from read2be import Read2Be



from collections import defaultdict
 
# def get_top_recommendations(predictions, topN=5):
#     top_recs = defaultdict(list)
#     for uid, iid, true_r, est, _ in predictions:
#         top_recs[uid].append((iid, est))
 
#     for uid, user_ratings in top_recs.items():
#         user_ratings.sort(key = lambda x: x[1], reverse = True)
#         top_recs[uid] = user_ratings[:topN]
#     return top_recs

# def list2df(data):
#     ratings_dict = {
#         "itemID": [],
#         "rating": [],
#         "userID": []
#     }
#     for user in data:
#         for book in user['books']:
#             ratings_dict['rating'].append(book['rate'])
#             ratings_dict['userID'].append(user['username'])
#             ratings_dict['itemID'].append(book['isbn'])
#      return pd.DataFrame(ratings_dict)

# import os, io

# def read_item_names():
#     """Read the u.item file from MovieLens 100-k dataset and returns a
#     mapping to convert raw ids into movie names.
#     """
 
#     file_name = (os.path.expanduser('~') +
#                  '/.surprise_data/ml-100k/ml-100k/u.item')
#     rid_to_name = {}
#     with io.open(file_name, 'r', encoding='ISO-8859-1') as f:
#         for line in f:
#             line = line.split('|')
#             rid_to_name[line[0]] = line[1]
 
#     return rid_to_name

# Convert from user list to ratings dataframe


# if __name__ == '__main__':
#     read2be = Read2Be()
#     df = list2df(list(read2be.get_users()))
#     reader = Reader(rating_scale=(0, 10))
#     data = Dataset.load_from_df(df[['userID', 'itemID', 'rating']], reader)
#     trainingSet = data.build_full_trainset()

#     sim_options = {
#         'name': 'cosine',
#         'user_based': False
#     }
    
#     knn = KNNBasic(sim_options=sim_options)
#     knn.fit(trainingSet)
#     testSet = trainingSet.build_anti_testset()
#     predictions = knn.test(testSet)
#     print(predictions)

#     #### Recomendacao feita para cada user 
#     top_recommendations = get_top_recommendations(predictions,topN=5)
#     #print(top_recommendations)







def get_top_recommendations(predictions, topN=5):
    top_recs = defaultdict(list)
    for uid, iid, true_r, est, _ in predictions:
        top_recs[uid].append((iid, est))
 
    for uid, user_ratings in top_recs.items():
        user_ratings.sort(key = lambda x: x[1], reverse = True)
        top_recs[uid] = user_ratings[:topN]
    return top_recs

def list2df(data):
    ratings_dict = {
        "itemID": [],
        "rating": [],
        "userID": []
    }
    for user in data:
        for book in user['books']:
            ratings_dict['rating'].append(book['rate'])
            ratings_dict['userID'].append(user['username'])
            ratings_dict['itemID'].append(book['isbn'])
    return pd.DataFrame(ratings_dict)


class CollaborativeFiltering:
    def __init__(self):
        self.usersdata = None
        self.top_recommendations = None

    def fit(self, usersdata):
        self.usersdata = usersdata

        df = list2df(self.usersdata)
        reader = Reader(rating_scale=(0, 10))
        data = Dataset.load_from_df(df[['userID', 'itemID', 'rating']], reader)
        trainingSet = data.build_full_trainset()
    
        sim_options = {
            'name': 'cosine',
            'user_based': False
        }
    
        knn = KNNBasic(sim_options=sim_options)
        knn.fit(trainingSet)
        testSet = trainingSet.build_anti_testset()
        predictions = knn.test(testSet)
        self.top_recommendations = get_top_recommendations(predictions,topN=5)

    def is_trained(self):
        return (self.top_recommendations != None)

    def predict(self, target_user, top_n=5):
        if target_user in self.top_recommendations:
            res = [ f for f,s in self.top_recommendations[target_user]]
            return res
        else:
            raise Exception(f"Cannot give recommendations for '{target_user}'")