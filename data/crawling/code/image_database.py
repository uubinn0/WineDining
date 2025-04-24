import os
import psycopg2
from dotenv import load_dotenv


load_dotenv('./.env')

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


# 이미지 파일이 있는 디렉토리
image_dir = "./converted_9"

print(image_dir)

try:
    # 파일명에서 숫자(id)만 추출 (예: 1.png → 1)
    image_ids = [int(f.split(".")[0]) for f in os.listdir(image_dir) if f.endswith(".png")]
    
    # SQL 쿼리 생성
    update_query = f"""
    UPDATE wines 
    SET image = CONCAT('https://winedining-s3.s3.ap-northeast-2.amazonaws.com/wines/', id, '.png') 
    WHERE id IN ({','.join(map(str, image_ids))})
    """
    
    # 쿼리 실행
    cur.execute(update_query)
    
    # 변경사항 커밋
    conn.commit()
    
    print(f"성공적으로 {len(image_ids)}개의 레코드가 업데이트되었습니다.")

except Exception as e:
    # 에러 발생 시 롤백
    conn.rollback()
    print(f"에러 발생: {str(e)}")

finally:
    # 연결 종료
    cur.close()
    conn.close()
    print("데이터베이스 연결이 종료되었습니다.")
