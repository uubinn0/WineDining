from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import base64
# import requests
from urllib.parse import unquote
from tqdm import tqdm

def convert_image(folder_path, folder_num):
    # 시작 시간 기록
    start_time = time.time()
    
    # Chrome 옵션 설정
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    
    # 출력 폴더 없는 경우 생성
    output_folder = f'./converted_{folder_num}'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # 에러 로그 파일 경로
    error_log_path = os.path.join(output_folder, 'error_files.txt')
    error_files = []  # 에러 발생한 파일 목록
    
    # 이미 변환된 파일 목록 확인
    converted_files = {os.path.splitext(f)[0] for f in os.listdir(output_folder) if f.endswith('.png')}
    
    # 처리할 이미지 파일 목록 생성 (미변환 파일만)
    image_files = []
    for f in os.listdir(folder_path):
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            name_without_ext = os.path.splitext(f)[0]
            if name_without_ext not in converted_files:  # 미변환 파일만 추가
                image_files.append(f)
    
    if not image_files:
        print("모든 이미지가 이미 변환되어 있습니다.")
        return
    
    total_files = len(image_files)
    print(f"\n총 {total_files}개의 미변환 이미지를 처리합니다.")
    
    # Chrome 웹드라이버 설정
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # 이미지 변환 사이트로 이동
        driver.get("https://pixel-me.tokyo/en/#google_vignette")
        
        for idx, filename in enumerate(image_files, 1):
            input_image = os.path.join(folder_path, filename)
            try:
                print(f"\n처리 중: {filename} ({idx}/{total_files})")
                
                # 이미 변환된 파일인지 한 번 더 확인
                filename_without_ext = os.path.splitext(filename)[0]
                output_path = os.path.join(output_folder, f'{filename_without_ext}.png')
                if os.path.exists(output_path):
                    print(f"이미 변환됨: {filename}")
                    continue
                
                # 파일 업로드를 위한 input 요소 찾기
                file_input = driver.find_element(By.CSS_SELECTOR, "input[data-v-0789884b][id='input-image']")
                
                # 이미지 파일 업로드
                file_input.send_keys(os.path.abspath(input_image))
                
                # 잠시 대기하여 파일 업로드 완료를 기다림
                time.sleep(2)
                
                # 변환된 이미지가 준비될 때까지 대기하고 URL 가져오기
                converted_image = WebDriverWait(driver, 30).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "img[data-v-2345a133].thumbnail__image"))
                )
                image_url = converted_image.get_attribute('src')
                
                # data:image/png;base64, 부분을 제거하고 실제 base64 데이터만 추출
                base64_data = image_url.split(',')[1]
                
                # 이미지 데이터 디코딩
                image_data = base64.b64decode(base64_data)
                
                # 파일로 저장
                with open(output_path, 'wb') as f:
                    f.write(image_data)
                
                print(f"저장 완료: {output_path}")
                
                # 페이지 새로고침하여 다음 이미지 처리 준비
                driver.refresh()
                time.sleep(2)
                
            except Exception as e:
                print(f"에러 발생 ({filename}): {str(e)}")
                # 에러 파일 목록에 추가
                error_files.append(f"{filename}: {str(e)}")
                driver.refresh()
                time.sleep(2)
                continue
        
        print(f"\n=== 모든 처리 완료 ===")
        print(f"처리된 이미지: {total_files}개")
        print(f"에러 발생 파일: {len(error_files)}개")
        
        # 에러 파일 목록 저장
        if error_files:
            with open(error_log_path, 'w', encoding='utf-8') as f:
                f.write(f"=== 에러 발생 파일 목록 ===\n")
                f.write(f"처리 시간: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"총 파일 수: {total_files}\n")
                f.write(f"에러 파일 수: {len(error_files)}\n\n")
                for error_file in error_files:
                    f.write(f"{error_file}\n")
            print(f"에러 파일 목록이 저장되었습니다: {error_log_path}")
        
        # 종료 시간 기록 및 총 소요 시간 계산
        end_time = time.time()
        total_time = end_time - start_time
        hours = int(total_time // 3600)
        minutes = int((total_time % 3600) // 60)
        seconds = int(total_time % 60)
        
        # 처리 시간 출력
        if hours > 0:
            print(f"총 소요 시간: {hours}시간 {minutes}분 {seconds}초")
        elif minutes > 0:
            print(f"총 소요 시간: {minutes}분 {seconds}초")
        else:
            print(f"총 소요 시간: {seconds}초")
        
        # 평균 처리 시간 계산 및 출력
        avg_time = total_time / total_files
        print(f"이미지당 평균 처리 시간: {avg_time:.1f}초")
        
    finally:
        # 모든 처리가 끝난 후 브라우저 종료
        driver.quit()

# 사용 예시
base_path = "../../crawling/data/image"  # 처리할 폴더 경로
folder_num = 9  # 출력 폴더 번호
folder_path = os.path.join(base_path, str(folder_num))  # os.path.join 사용

convert_image(folder_path, folder_num)