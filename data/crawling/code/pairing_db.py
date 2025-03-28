import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv

# CSV 파일 로드
csv_file = "../data/wine_data_pairing.csv"
df = pd.read_csv(csv_file)

load_dotenv('../../.env')

print('USER : ', os.getenv('DB_USER'),)
print('NAME : ', os.getenv('DB_NAME'),)
print('PASSWORD : ', os.getenv('DB_PASSWORD'),)
print('HOST : ', os.getenv('DB_HOST', 'localhost'),)
print('PORT : ', os.getenv('DB_PORT', '5432'))

# PostgreSQL 연결 정보
conn = psycopg2.connect(
    dbname = os.getenv('DB_NAME'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    host = os.getenv('DB_HOST', 'localhost'),
    port = os.getenv('DB_PORT', '5432')
)
cur = conn.cursor()

drop_col = ['kr_name', 'en_name', 'pairing']
df.drop(columns=drop_col, inplace=True)

print(df.info())

# 음식 카테고리 매핑 딕셔너리
food_mapping = {
    "소고기": 1,
    "돼지고기": 2,
    "닭/오리": 3,
    "양고기": 4,
    "생선": 5,
    "해산물": 6,
    "건육": 7,
    "채소/샐러드": 8,
    "튀김": 9,
    "치즈": 10,
    "과일/건과일": 11,
    "디저트": 12,
    "한식": 13,
    "중식": 14,
    "양식": 15,
    "아시아음식": 16,
    "견과": 17
}

def insert_pairing_data(df):
    # pairing 컬럼의 값을 쉼표로 분리하고 각각의 음식에 대해 매핑된 ID로 변환
    for index, row in df.iterrows():
        # NaN값인 경우 건너뛰기
        if pd.isna(row['pairing_list']):
            continue
            
        # wines 테이블에 해당 id가 있는지 확인
        cur.execute("SELECT id FROM wines WHERE id = %s", (row['idx'],))
        exists = cur.fetchone()
        
        # wines 테이블에 없는 id면 건너뛰기
        if not exists:
            continue
            
        # 각 와인의 food_id에 대해 처리 
        food_id = food_mapping[row['pairing_list'].strip()]
        
        # cur.execute("INSERT INTO pairing_sets (id, wine_id, food_id) VALUES (%s, %s, %s)", (index, row['idx'], food_id))
        
        # 각 food_id에 대해 개별적으로 레코드 삽입
        cur.execute("INSERT INTO pairing_sets (wine_id, food_id) VALUES (%s, %s)", (row['idx'], food_id))
    
    conn.commit()

# 데이터 삽입 실행
insert_pairing_data(df)

# 연결 종료
cur.close()
conn.close()

