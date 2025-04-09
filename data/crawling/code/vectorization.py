import psycopg2
from dotenv import load_dotenv
import os
import pandas as pd
import numpy as np
from psycopg2.extras import execute_values
from psycopg2 import Binary
load_dotenv('../../.env')

# PostgreSQL 연결 정보
conn = psycopg2.connect(
    dbname = os.getenv('DB_NAME'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    host = os.getenv('DB_HOST', 'localhost'),
    port = os.getenv('DB_PORT', '5432')
)
cursor = conn.cursor()

# Enable pgvector extension if not exists
cursor.execute("CREATE EXTENSION IF NOT EXISTS vector")

# NULL값을 갖는 데이터 제외
# Get wine data from database
query = """
    SELECT id, acidity, alcohol_content, body, 
           sweetness, tannin, type_id 
    FROM wines
    WHERE acidity IS NOT NULL AND alcohol_content IS NOT NULL AND body IS NOT NULL AND
           sweetness IS NOT NULL AND tannin IS NOT NULL AND type_id IS NOT NULL
"""

cursor.execute(query)
wines = cursor.fetchall()
columns = ['id', 'acidity', 'alcohol_content', 'body',
           'sweetness', 'tannin', 'type_id']
wine_data = pd.DataFrame(wines, columns=columns)
print(wine_data.info())

# Convert categorical variables to numerical using one-hot encoding
categorical_columns = ['type_id']
wine_data_encoded = pd.get_dummies(wine_data, columns=categorical_columns)

def create_wine_vector(row):
    # 정규화 0 ~ 1 사이 값으로
    # Normalize numerical features to range [0,1]
    numerical_features = [
        float(row['acidity']) / 6,  # 0 ~ 6
        float(row['alcohol_content']) / 100,  # 0 ~ 100
        float(row['body']) / 6,  # 0 ~ 6
        float(row['sweetness']) / 6,  # 0 ~ 6
        float(row['tannin']) / 6  # 0 ~ 6
    ]
    
    # Get one-hot encoded categorical features
    categorical_features = [
        float(value) for key, value in row.items() 
        if key.startswith(('type_id_'))
    ]
    
    # Combine all features into a single vector
    return numerical_features + categorical_features
    # return numerical_features

# 희소 벡터화
def to_sparse_vector(vector):
    # 벡터에서 0이 아닌 값들의 인덱스와 값을 튜플로 묶어 리스트로 반환
    sparse_vector = [{str(i): value} for i, value in enumerate(vector) if value != 0]
    return sparse_vector


# Create vectors for each wine
wine_vectors = []
wine_ids = []
for idx, row in wine_data_encoded.iterrows():
    vector = create_wine_vector(row)
    # vector = to_sparse_vector(vector)
    # print(vector)
    wine_vectors.append(vector)
    wine_ids.append(row['id'])

# print(wine_ids[10])
print(wine_vectors[10])

## 벡터화 데이터를 DB에 저장 ###
# 테이블이 이미 존재한다면 제거 후 다시 생성
cursor.execute("""
    DROP TABLE IF EXISTS preference_wine_vectors;
    CREATE TABLE preference_wine_vectors (
        wine_id INTEGER PRIMARY KEY REFERENCES wines(id),
        vector vector(%s) 
    )
""", (len(wine_vectors[0]),))

# Insert vectors into database in batches
batch_size = 100
for i in range(0, len(wine_ids), batch_size):
    batch_wine_ids = wine_ids[i:i+batch_size]
    batch_vectors = wine_vectors[i:i+batch_size]
    
    # Prepare batch data
    batch_data = []
    for wine_id, vector in zip(batch_wine_ids, batch_vectors):
        vector_array = np.array(vector, dtype=np.float32)
        vector_str = '[' + ','.join(map(str, vector_array)) + ']'
        batch_data.append((wine_id, vector_str))
    
    # Execute batch insert
    execute_values(cursor, """
        INSERT INTO preference_wine_vectors (wine_id, vector)
        VALUES %s
        ON CONFLICT (wine_id) DO UPDATE 
        SET vector = EXCLUDED.vector
    """, batch_data)
    
    # Commit after each batch
    conn.commit()
    print(f"Processed batch {i//batch_size + 1} of {(len(wine_ids) + batch_size - 1)//batch_size}")

cursor.close()
conn.close()
