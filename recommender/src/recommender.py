from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

DEBUG = True

class ContentFiltering:
    def __init__(self):
        self.similarities = None
        self.booksdata = None
        self.booksdata_series = None
        self.trained = False

    def fit(self, booksdata):
        self.booksdata = booksdata
        # for b in booksdata:
        #     del b['_id']
        #     self.booksdata.append(b)
        self.booksdata_series = pd.Series(self.booksdata)
        self.books_titles = [ b["title"] for b in booksdata ]
        self.books_titles_series = pd.Series(self.books_titles)
        self.books_isbns = [ b["isbn"] for b in booksdata ]
        self.books_isbns_series = pd.Series(self.books_isbns)

        cv_matrix = CountVectorizer().fit_transform(self.books_titles)
        self.similarities = cosine_similarity(cv_matrix,cv_matrix)
        self.trained = True

    def is_trained(self):
        return self.trained

    def predict(self, target_isbn, top_n=5):
        if self.is_trained():
            idx = self.books_isbns_series[self.books_isbns_series == target_isbn].index[0]
            final = pd.Series(self.similarities[idx]).sort_values(ascending=False)
            top_n_indexes = list(final.drop(index=idx).iloc[:top_n].index)

            if DEBUG:
                return self.booksdata_series[top_n_indexes]
                #return zip(self.books_isbns_series[top_n_indexes],self.books_titles_series[top_n_indexes])
            else:
                return self.books_isbns_series[top_n_indexes]
        else:
            raise Exception("Model must be trained to provide recommendations")