import pandas as pd
import psycopg2
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.metrics import silhouette_score
import numpy as np
from dotenv import load_dotenv
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from scipy.stats import chi2_contingency
from sklearn.decomposition import PCA

load_dotenv('../../.env')

# PostgreSQL 연결 정보
conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST', 'localhost'),
    port=os.getenv('DB_PORT', '5432')
)

# Get wine data from PostgreSQL
query = "SELECT * FROM wines"
df = pd.read_sql_query(query, conn)
conn.close()

# Select features for clustering
features = ['acidity', 'sweetness', 'alcohol_content', 'body', 'tannin', 'country', 'type_id']
X = df[features]

# 결측값 -1로 처리
X['alcohol_content'] = X['alcohol_content'].fillna(-1)

# 알콜값 결측 여부 컬럼 추가
# X['is_alcohol_data'] = (X['alcohol_content'] != -1).astype(int)

# 원-핫 인코딩
# X = pd.get_dummies(X, columns=['country', 'type_id', 'is_alcohol_data'], prefix=['country','type_id', 'is_alcohol_data'])
X = pd.get_dummies(X, columns=['country', 'type_id'], prefix=['country','type_id'])

print(X)

# 가중치 설정
weights = np.ones(X.shape[1])  # 기본 가중치 1로 초기화

# 특정 컬럼에 대한 가중치 설정
for i, col in enumerate(X.columns):
    if 'alcohol_content' in col:
        weights[i] = 0.3  # alcohol 관련 특성의 가중치 낮춤
    elif 'is_alcohol_data' in col:
        weights[i] = 0.3  # alcohol 관련 특성의 가중치 낮춤 

# 가중치 적용
X_weighted = X * weights

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_weighted)

# Calculate silhouette scores for different numbers of clusters
silhouette_scores = []
inertias = []
K = range(2, 100)

for k in K:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    
    # Silhouette score
    score = silhouette_score(X_scaled, kmeans.labels_)
    silhouette_scores.append(score)
    
    # Inertia (for elbow method)
    inertias.append(kmeans.inertia_)

# Plot both methods side by side
plt.figure(figsize=(15, 5))

# Silhouette scores
plt.subplot(1, 2, 1)
plt.plot(K, silhouette_scores, 'ro-')
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Score vs Number of Clusters')
plt.grid(True)

# Elbow curve
plt.subplot(1, 2, 2)
plt.plot(K, inertias, 'bo-')
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal k')
plt.grid(True)

plt.tight_layout()
plt.show()

# Find optimal k from silhouette score
optimal_k_silhouette = K[np.argmax(silhouette_scores)]
print(f"Optimal number of clusters (Silhouette Method): {optimal_k_silhouette}")
print(f"Best silhouette score: {max(silhouette_scores):.3f}")

def find_elbow_point(K, inertias):
    # 1차 차분 계산
    diffs = np.diff(inertias)
    
    # 2차 차분 계산
    diffs2 = np.diff(diffs)
    
    # 2차 차분이 가장 큰 지점이 엘보우 포인트
    elbow_index = np.argmax(np.abs(diffs2)) + 1
    
    return K[elbow_index]

# 엘보우 포인트 찾기
optimal_k_elbow = find_elbow_point(list(K), inertias)
print(f"Optimal number of clusters (Elbow Method): {optimal_k_elbow}")

# 결과 시각화를 위한 추가 코드
plt.figure(figsize=(10, 6))
plt.plot(K, inertias, 'bo-')
plt.plot(optimal_k_elbow, inertias[list(K).index(optimal_k_elbow)], 'ro', markersize=12, label='Elbow Point')
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal k')
plt.legend()
plt.grid(True)
plt.show()