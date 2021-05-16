from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class ContentFiltering:
    def __init__(self):
        self.similarities = None
        self.booksdata = None
        self.booksdata_series = None

    def fit(self, booksdata):
        self.booksdata = booksdata
        self.booksdata_series = pd.Series(booksdata)
        cv_matrix = CountVectorizer().fit_transform(booksdata)
        self.similarities = cosine_similarity(cv_matrix,cv_matrix)

    def is_trained(self):
        return (self.booksdata != None)

    def predict(self, target_book, top_n=5):
        if self.is_trained():
            idx = self.booksdata_series[self.booksdata_series == target_book].index[0]
            final = pd.Series(self.similarities[idx]).sort_values(ascending=False)
            top_n_indexes = list(final.drop(index=idx).iloc[:top_n].index)
            return self.booksdata_series[top_n_indexes]
        else:
            Exception("Model must be trained to provide recommendations")