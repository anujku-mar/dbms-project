import pandas as pd

df = pd.read_csv("data/ir_train.csv", nrows=10)
print(pd.io.sql.get_schema(df, "ir_train"))