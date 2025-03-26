import psycopg2
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import os
from dotenv import load_dotenv
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

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

# Drop rows where 'alcohol_content' is NaN
df.dropna(subset=['alcohol_content'], inplace=True)
# print(df.info())

# Prepare features and scale them
df = df.iloc[10:, :]
# print(idx.info())
# idx = df['id']
features = ['acidity', 'sweetness', 'alcohol_content', 'body', 'tannin', 'country', 'grape', 'type_id']  # Adjust these based on your actual columns
X = df[features]
# print(X.info())


# 레이블 인코딩
label_encoder = LabelEncoder()
X['country_encoded'] = label_encoder.fit_transform(X['country'])
X['grape_encoded'] = label_encoder.fit_transform(X['grape'])

# Drop original 'country' and 'grape' columns
X.drop('country', axis=1, inplace=True)
X.drop('grape', axis=1, inplace=True)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Create and train K-means model
n_clusters = 7  # 군집 수 설정
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
clusters = kmeans.fit_predict(X_scaled)
# print(type(idx))
# print(type(clusters))
# print(clusters.shape)
# print('=> ', clusters)
# print(len(idx))
# print(len(clusters))

'''
# cluster visualization
# Reduce dimensions to 2D for visualization
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Create scatter plot
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=clusters, cmap='viridis')
plt.title('Wine Clusters Visualization')
plt.xlabel('First Principal Component')
plt.ylabel('Second Principal Component')
plt.colorbar(scatter, label='Cluster Labels')

# Add cluster centers
centers_pca = pca.transform(kmeans.cluster_centers_)
plt.scatter(centers_pca[:, 0], centers_pca[:, 1], c='red', marker='x', s=200, linewidths=3, label='Cluster Centers')
plt.legend()
plt.show()

# Save the plot
plt.savefig('wine_clusters.png')
plt.close()

Print explained variance ratio
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
'''

# Add cluster labels to original dataframe
df['wine_group_id'] = clusters
print(df.info())


# Save results back to database
conn = psycopg2.connect(
    dbname = os.getenv('DB_NAME'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    host = os.getenv('DB_HOST', 'localhost'),
    port = os.getenv('DB_PORT', '5432')
)
cursor = conn.cursor()


# Insert results
for index, row in df.iterrows():
    cursor.execute(
        "UPDATE wines SET wine_group_id = %s WHERE id = %s",
        (row['wine_group_id'], row['id'])
        # "INSERT INTO wine_clusters (wine_id, cluster_label) VALUES (%s, %s) ON CONFLICT (wine_id) DO UPDATE SET cluster_label = EXCLUDED.cluster_label",
        # (row['id'], row['cluster'])
    )

conn.commit()
conn.close()