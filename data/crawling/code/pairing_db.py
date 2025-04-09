import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv

# CSV 파일 로드
csv_file = "../data/pairing_dataset_4_6.csv"
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

drop_col = ['kr_name', 'en_name']
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
    inserted_count = 0
    skipped_count = 0
    
    print(f"처리할 총 데이터 수: {len(df)}")
    
    for index, row in df.iterrows():
        # NaN값인 경우 건너뛰기
        if pd.isna(row['pairing']):
            skipped_count += 1
            continue
            
        # wines 테이블에 해당 id가 있는지 확인
        cur.execute("SELECT id FROM wines WHERE id = %s", (row['idx'],))
        exists = cur.fetchone()
        
        # wines 테이블에 없는 id면 건너뛰기
        if not exists:
            skipped_count += 1
            continue
            
        try:
            # 각 행의 pairing 값을 그대로 사용
            food_category = row['pairing'].strip()
            if food_category in food_mapping:
                food_id = food_mapping[food_category]
                cur.execute(
                    "INSERT INTO pairing_sets (wine_id, food_id) VALUES (%s, %s)", 
                    (row['idx'], food_id)
                )
                inserted_count += 1
            
            # 100개 단위로 커밋
            if index % 100 == 0:
                conn.commit()
                print(f"진행 중... {index}/{len(df)} 처리됨")
                
        except Exception as e:
            print(f"에러 발생 - idx: {row['idx']}, pairing: {row['pairing']}, error: {str(e)}")
            conn.rollback()
    
    # 마지막 커밋
    conn.commit()
    
    print(f"\n처리 완료:")
    print(f"- 삽입된 페어링 수: {inserted_count}")
    print(f"- 건너뛴 레코드 수: {skipped_count}")

# 실행 전 기존 데이터 확인
cur.execute("SELECT COUNT(*) FROM pairing_sets")
before_count = cur.fetchone()[0]
print(f"삽입 전 pairing_sets 테이블의 레코드 수: {before_count}")

# 데이터 삽입 실행
insert_pairing_data(df)

# 삽입 후 데이터 확인
cur.execute("SELECT COUNT(*) FROM pairing_sets")
after_count = cur.fetchone()[0]
print(f"삽입 후 pairing_sets 테이블의 레코드 수: {after_count}")
print(f"추가된 레코드 수: {after_count - before_count}")

# 연결 종료
cur.close()
conn.close()

