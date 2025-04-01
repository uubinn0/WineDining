# 1. Python 이미지를 베이스로 사용
FROM python:3.12

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일을 컨테이너에 복사
COPY requirements.txt /app/

# 4. 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 5. .env 파일 복사 (추가된 부분)
COPY .env /app/

# 6. FastAPI 애플리케이션 코드 복사
COPY app /app/app

# 7. FastAPI 애플리케이션 실행 명령어
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
