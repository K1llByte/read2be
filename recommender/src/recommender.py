from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

DEBUG = True

class ContentFiltering:
    def __init__(self):
        self.similarities = None
        self.booksdata = None
        self.booksdata_series = None

    def fit(self, booksdata):
        self.booksdata = booksdata
        self.books_titles = [ b["title"] for b in booksdata ]
        self.books_titles_series = pd.Series(self.books_titles)
        self.books_isbns = [ b["isbn"] for b in booksdata ]
        self.books_isbns_series = pd.Series(self.books_isbns)

        cv_matrix = CountVectorizer().fit_transform(self.books_titles)
        self.similarities = cosine_similarity(cv_matrix,cv_matrix)

    def is_trained(self):
        return (self.booksdata != None)

    def predict(self, target_isbn, top_n=5):
        if self.is_trained():
            print(self.books_isbns_series[self.books_isbns_series == target_isbn])
            idx = self.books_isbns_series[self.books_isbns_series == target_isbn].index[0]
            final = pd.Series(self.similarities[idx]).sort_values(ascending=False)
            top_n_indexes = list(final.drop(index=idx).iloc[:top_n].index)

            if DEBUG:
                return zip(self.books_isbns_series[top_n_indexes],self.books_titles_series[top_n_indexes])
            else:
                return self.books_isbns_series[top_n_indexes]
        else:
            Exception("Model must be trained to provide recommendations")