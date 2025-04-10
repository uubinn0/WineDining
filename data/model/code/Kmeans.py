import psycopg2
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import os
from dotenv import load_dotenv
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder
import numpy as np

load_dotenv('../../.env')

# PostgreSQL 연결 정보
conn = psycopg2.connect(
    dbname = os.getenv('DB_NAME'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    host = os.getenv('DB_HOST', 'localhost'),
    port = os.getenv('DB_PORT', '5432')
)

# Get wine data from database
query = "SELECT * FROM wines"
df = pd.read_sql_query(query, conn)
conn.close()

df['alcohol_content_was_na'] = df['alcohol_content'].isna()
df['alcohol_content'].fillna(round(df['alcohol_content'].mean(), 1), inplace=True)

# print(idx.info())
idx = df['id']
features = ['acidity', 'sweetness', 'alcohol_content', 'body', 'tannin', 'country', 'type_id', 'alcohol_content_was_na']  # Adjust these based on your actual columns
X = df[features]
# print(X.info())

# one-hot 인코딩
X = pd.get_dummies(X, columns=['country', 'type_id'], prefix=['country','type_id'])
print(X.head())
print(X.info())



# # 가중치 설정
# weights = np.ones(X.shape[1])  # 기본 가중치 1로 초기화

# # 특정 컬럼에 대한 가중치 설정
# for i, col in enumerate(X.columns):
#     if 'alcohol_content' in col:
#         weights[i] = 0.3  # alcohol 관련 특성의 가중치 낮춤
#     elif 'is_alcohol_data' in col:
#         weights[i] = 0.3  # alcohol 관련 특성의 가중치 낮춤 

# # 가중치 적용
# X_weighted = X * weights

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Create and train K-means model
n_clusters = 37  # 군집 수 설정
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
clusters = kmeans.fit_predict(X_scaled)
# print(type(idx))
# print(type(clusters))
# print(clusters.shape)
# print('=> ', clusters)
# print(len(idx))
# print(len(clusters))


# cluster visualization
# Reduce dimensions to 3D for visualization
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)

# Create 3D scatter plot
fig = plt.figure(figsize=(12, 10))
ax = fig.add_subplot(111, projection='3d')

# Plot the points
scatter = ax.scatter(X_pca[:, 0], X_pca[:, 1], X_pca[:, 2], c=clusters, cmap='viridis')

# Add cluster centers
centers_pca = pca.transform(kmeans.cluster_centers_)
ax.scatter(centers_pca[:, 0], centers_pca[:, 1], centers_pca[:, 2], 
           c='red', marker='x', s=200, linewidths=3, label='Cluster Centers')

# Set labels
ax.set_title('Wine Clusters 3D Visualization')
ax.set_xlabel('First Principal Component')
ax.set_ylabel('Second Principal Component')
ax.set_zlabel('Third Principal Component')

# Add colorbar
plt.colorbar(scatter, label='Cluster Labels')
plt.legend()

# Save the plot
plt.savefig('wine_clusters_3d.png')
plt.close()

# Print explained variance ratio
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")


# Add cluster labels to original dataframe
df['wine_group_id'] = clusters



# Save results back to database
conn = psycopg2.connect(
    dbname = os.getenv('DB_NAME'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    host = os.getenv('DB_HOST', 'localhost'),
    port = os.getenv('DB_PORT', '5432')
)
cursor = conn.cursor()

# Batch size 설정
batch_size = 100
total_records = len(df)

# 100개 단위로 배치 처리
for i in range(0, total_records, batch_size):
    batch = df.iloc[i:i+batch_size]
    print(f"Processing batch {i//batch_size + 1} of {(total_records + batch_size - 1)//batch_size}")
    
    # 배치 데이터 준비
    batch_data = [(row['wine_group_id'], row['id']) for _, row in batch.iterrows()]
    
    # 배치 업데이트 실행
    cursor.executemany(
        "UPDATE wines SET wine_group_id = %s WHERE id = %s",
        batch_data
    )
    
    # 각 배치마다 커밋
    conn.commit()

conn.close()
