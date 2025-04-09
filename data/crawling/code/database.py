import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv

# CSV 파일 로드
csv_file = "../data/preprocessed_wine_dataset_6.csv"
df = pd.read_csv(csv_file)
print(df.info())

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


# Create Table
def create_table(tbl_name):
    # 테이블 이름 검증 (예: 영문자, 숫자 및 언더스코어만 허용)
    if not tbl_name.isidentifier():
        raise ValueError(f"Invalid table name: {tbl_name}")


    # 쿼리
    query = f"""
        CREATE TABLE IF NOT EXISTS {tbl_name} (
            id SERIAL PRIMARY KEY    
        )
    """

    cur.execute(query)
    conn.commit()

    # 연결 종료
    cur.close
    conn.close


#Insert
def instert_wine_data(df):
    # DataFrame을 PostgreSQL에 삽입
    for index, row in df.iterrows():
        # type_id가 NaN인 경우 건너뛰기
        if pd.isna(row['type_id']):
            print(f"Skipping row with index {index}: type_id is NULL")
            continue

        # 해당 ID가 존재하는지 확인
        cur.execute("SELECT id FROM wines WHERE id = %s", (row['idx'],))
        exists = cur.fetchone()
        
        # 존재하면 삭제
        if exists:
            cur.execute("DELETE FROM wines WHERE id = %s", (row['idx'],))


        values = [None if pd.isna(val) else val for val in [
            row['idx'], row['acidity'], row['alcohol_content'], 
            row['body'], row['country'], row['en_name'], 
            row['grape'], row['kr_name'], row['price'], 
            row['sweetness'], row['tannin'], row['type_id']
        ]]

        cur.execute("""
            INSERT INTO wines (id, acidity, alcohol_content, body, country, en_name, grape, kr_name, price, sweetness, tannin, type_id, created_at, wine_group_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, NULL)
        """,values)

    conn.commit()

    cur.close()
    conn.close()


instert_wine_data(df)