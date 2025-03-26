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
features = ['acidity', 'sweetness', 'alcohol_content', 'body', 'tannin', 'country', 'grape', 'type_id']  # Adjust these based on your actual columns
X = df[features]

# Drop rows where 'alcohol_content' is NaN
X = X.dropna(subset=['alcohol_content'])

# 레이블 인코딩
label_encoder = LabelEncoder()
X['country_encoded'] = label_encoder.fit_transform(X['country'])
X['grape_encoded'] = label_encoder.fit_transform(X['grape'])

# Drop original 'country' and 'grape' columns
X.drop('country', axis=1, inplace=True)
X.drop('grape', axis=1, inplace=True)

# Handle missing values in other columns if necessary (now alcohol_content is cleaned)
imputer = SimpleImputer(strategy='mean')  # Use the mean to impute missing values
X_imputed = imputer.fit_transform(X)

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# Calculate silhouette scores for different numbers of clusters
silhouette_scores = []
inertias = []
K = range(2, 12)

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
plt.plot(K, silhouette_scores, 'bo-')
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Score vs Number of Clusters')
plt.grid(True)

# Elbow curve
plt.subplot(1, 2, 2)
plt.plot(K, inertias, 'ro-')
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

# Calculate elbow point using the maximum curvature
def find_elbow_point(x, y):
    # Normalize the data
    x = np.array(x)
    y = np.array(y)
    x_norm = (x - min(x)) / (max(x) - min(x))
    y_norm = (y - min(y)) / (max(y) - min(y))
    
    # Calculate the angles
    angles = []
    for i in range(1, len(x_norm)-1):
        point = np.array([x_norm[i], y_norm[i]])
        point1 = np.array([x_norm[i-1], y_norm[i-1]])
        point2 = np.array([x_norm[i+1], y_norm[i+1]])
        
        vec1 = point1 - point
        vec2 = point2 - point
        
        angle = np.arccos(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))
        angles.append(angle)
    
    return K[1:-1][np.argmax(angles)]

optimal_k_elbow = find_elbow_point(K, inertias)
print(f"Optimal number of clusters (Elbow Method): {optimal_k_elbow}")
