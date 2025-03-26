from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import time
import requests
import os
from urllib.parse import urlparse
from concurrent.futures import ProcessPoolExecutor
import multiprocessing

class Wine21Crawler:
    def __init__(self):
        # 모바일 환경 설정
        mobile_emulation = {
            "deviceMetrics": { "width": 412, "height": 915, "pixelRatio": 3.5 },  # Galaxy S20 Ultra 크기
            "userAgent": "Mozilla/5.0 (Linux; Android 10; SM-G988B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36"
        }
        
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
        # chrome_options.add_argument('--headless')  # 헤드리스 모드 제거
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-images')  # 이미지 로딩 비활성화
        chrome_options.add_argument('--disable-javascript')  # 자바스크립트 비활성화
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.base_url = "https://www.wine21.com/13_search/wine_view.html?Idx={}&lq=LIST"
        self.wine_data = []

        # 크롤링 횟차를 입력받기
        crawl_count = int(input("크롤링 횟차를 입력하세요: "))

        # 이미지 저장 디렉토리 생성
        self.image_dir = f'../data/image/{crawl_count}/'
        if not os.path.exists(self.image_dir):
            os.makedirs(self.image_dir)

        # 로그 파일, csv 파일 이름에 크롤링 횟차 추가
        self.progress_log = f"../log/progress_log_{crawl_count}.txt"
        self.csv_file_name = f"../data/wine/wine21_data_{crawl_count}.csv"

        # 마지막 크롤링 로그
        if crawl_count > 1 : 
            self.last_progress_log = f"../log/progress_log_{crawl_count-1}.txt"
        elif crawl_count == 1: 
            self.last_progress_log = f"../log/progress_log_{crawl_count}.txt"
        else:
            print("올바른 크롤링 횟차를 입력하세요.")
            
        # 이미지 다운로드 에러 로그 파일 설정
        self.error_log = f'../download_errors.txt'
        
    
    # 에러 로그 기록
    def log_error(self, idx, error_msg):
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        with open(self.error_log, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] IDX: {idx} - {error_msg}\n")


    # 크롤링 진행 로그 기록
    def log_progress(self, idx, status):
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        with open(self.progress_log, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] IDX: {idx} - {status}\n")


    # 문자열 전처리 후 수집
    def get_text(self, selector):
        try:
            element = self.driver.find_element(By.CSS_SELECTOR, selector)
            return element.text.strip()
        except:
            return None


    # 이미지 url 수집, 기본 이미지인 경우 no_image 반환
    def get_image_src(self, selector):
        try:
            element = self.driver.find_element(By.CSS_SELECTOR, selector)
            image_url = element.get_attribute('src')
            # 기본 이미지인 경우 'no_image' 반환
            if 'no_image2.jpg' in image_url:
                return 'no_image'
            return image_url
        except:
            return None


    # 이미지 저장
    def download_image(self, image_url, idx):
        try:
            if not image_url:
                self.log_error(idx, "이미지 URL이 없음")
                return None
            
            # 기본 이미지인지 다시 한 번 체크
            if 'no_image2.jpg' in image_url:
                return 'no_image'
                
            # 이미지 확장자 추출
            ext = os.path.splitext(urlparse(image_url).path)[1]
            if not ext:
                ext = '.png'  # 기본 확장자
                
            # 저장할 파일 경로
            filename = f'{idx}{ext}'
            filepath = os.path.join(self.image_dir, filename)
            
            # 이미지 다운로드
            response = requests.get(image_url)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                return filename
            else:
                self.log_error(idx, f"이미지 다운로드 실패 (HTTP {response.status_code})")
                return None
        except Exception as e:
            self.log_error(idx, f"이미지 다운로드 중 에러 발생: {str(e)}")
            return None


    # 음식 카테고리를 이미지 URL 값으로 분류
    def get_food_categories(self):
        try:
            food_categories = []
            food_images = self.driver.find_elements(By.CSS_SELECTOR, 'ul.clear.swiper-wrapper li em img')
            
            for img in food_images:
                img_src = img.get_attribute('src')
                if not img_src:
                    continue
                
                # 이미지 URL에 문자열 포함됐는지 확인하여 카테고리 판단
                if 'food-cow' in img_src:
                    food_categories.append('소고기')
                elif 'food-pig' in img_src:
                    food_categories.append('돼지고기')
                elif 'food-chicken' in img_src:
                    food_categories.append('닭/오리')
                elif 'food-sheep' in img_src:
                    food_categories.append('양고기')
                elif 'food-fish' in img_src:
                    food_categories.append('생선')
                elif 'food-chellfish' in img_src:
                    food_categories.append('해산물')
                elif 'food-dry' in img_src or 'food-salami' in img_src:
                    food_categories.append('건육')
                elif 'food-salad' in img_src:
                    food_categories.append('채소/샐러드')
                elif 'food-fried' in img_src:
                    food_categories.append('튀김')
                elif 'food-cheese' in img_src:
                    food_categories.append('치즈')
                elif 'food-fruit' in img_src or 'food-raisin' in img_src:
                    food_categories.append('과일/건과일')
                elif 'food-cake' in img_src:
                    food_categories.append('디저트')
                elif 'food-bibimbap' in img_src:
                    food_categories.append('한식')
                elif 'food-asia' in img_src:
                    food_categories.append('중식')
                elif 'food-pizza' in img_src:
                    food_categories.append('양식')
                elif 'food-noodle' in img_src:
                    food_categories.append('아시아음식')
                elif 'food-walnut' in img_src:
                    food_categories.append('견과')
            
            return ', '.join(food_categories) if food_categories else None
        except:
            return None


    # 데이터 크롤링
    def crawl_wine_detail(self, idx):
        try:
            url = self.base_url.format(idx)
            self.driver.get(url)
            
            # 동적 대기 설정
            wait = WebDriverWait(self.driver, 4)
            
            try:
                # alert 체크
                # alert = self.driver.switch_to.alert
                alert = WebDriverWait(self.driver, 1).until(EC.alert_is_present())
                if "와인정보가 검색되지 않았습니다" in alert.text:
                    # time.sleep(0.5)
                    # alert.accept()
                    self.log_progress(idx, "와인 정보 없음")
                    print(f"Wine not found for idx: {idx}")
                    return False
            except:
                pass

            try:
                # 와인 이름이 로드될 때까지 대기
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'dt.wine-name')))
            except:
                self.log_progress(idx, "페이지 로딩 실패")
                return False
            
            # 태그 내 이미지 URL 가져오기
            image_url = self.get_image_src('.swiper-slide img')
            # 이미지가 있는 경우만 다운로드, 없는 경우 'no_image' 반환
            local_image = 'no_image' if image_url == 'no_image' else self.download_image(image_url, idx)
            
            wine_info = {
                'idx': idx,
                'kr_name': self.get_text('dt.wine-name'),
                'en_name': self.get_text('dd.wine-name-en'),
                '와인_이미지_URL': image_url,
                '와인_이미지_파일명': local_image,
                'country': self.get_text('p.dib span:nth-child(2)'),
                'grape': self.get_text('h4.wine-name a'),
                'price': self.get_text('.price'),
                'sweetness': self.get_gauge_value('당도'),
                'acidity': self.get_gauge_value('산도'),
                'tannin': self.get_gauge_value('타닌'),
                'body': self.get_gauge_value('바디'),
                'alcohol_content': self.get_alcohol_content(),
                'type': self.get_wine_type(),
                'pairing': self.get_food_categories(),
                # '생산년도': self.get_text('.vintage'),
                # '등록일': None,
            }
            self.wine_data.append(wine_info)
            self.log_progress(idx, "크롤링 성공")
            print(f"Successfully crawled wine idx: {idx}")
            return True
            
        except Exception as e:
            self.log_progress(idx, f"크롤링 실패: {str(e)}")
            print(f"Error crawling idx {idx}: {e}")
            return False


    # 와인 특성(당도, 산도, 타닌, 바디)의 값을 가져오는 메소드
    def get_gauge_value(self, component_name):
        try:
            # wine-components 내의 각 li 요소들을 찾음
            components = self.driver.find_elements(By.CSS_SELECTOR, '.wine-components li')
            
            # 각 특성에 맞는 li 요소 찾기
            for comp in components:
                txt = comp.find_element(By.CSS_SELECTOR, '.wine-c-txt').text
                if txt == component_name:
                    # on 클래스를 가진 a 태그 개수 세기
                    on_count = len(comp.find_elements(By.CSS_SELECTOR, 'a.on'))
                    return on_count
            return None
        except:
            return None


    # 도수 정보 가져와 전처리
    def get_alcohol_content(self):
        try:
            # dt 태그에서 '알코올' 텍스트를 찾고, 그 다음의 dd 태그 값을 가져옴
            dl_elements = self.driver.find_elements(By.CSS_SELECTOR, '.wine-d-box-info-list dl')
            for dl in dl_elements:
                dt = dl.find_element(By.TAG_NAME, 'dt')
                if '알코올' in dt.text:
                    dd = dl.find_element(By.TAG_NAME, 'dd')
                    # 숫자만 추출 (예: "14~15 %" -> "14~15")
                    alcohol = dd.text.replace('%', '').strip()
                    return alcohol
            return None
        except:
            return None


    # 클래스 명으로 와인 종류 분류
    def get_wine_type(self):
        try:
            # 모든 뱃지 요소들을 찾음
            badges = self.driver.find_elements(By.CSS_SELECTOR, 'span.bagde-item')
            
            for badge in badges:
                class_name = badge.get_attribute('class')
                if 'bagde-red-fill' in class_name:
                    return '레드'
                elif 'bagde-blue-fill' in class_name:
                    return '화이트'
                elif 'bagde-yellow-fill' in class_name:
                    return '스파클링'
                elif 'bagde-rose-fill' in class_name:
                    return '로제'
            return None
        except Exception as e:
            print(f"와인 종류 추출 중 에러 발생: {str(e)}")
            return None


    # 크롤링 진행 로그에서 마지막으로 접근한 인덱스를 찾기
    def get_last_idx(self):
        try:
            if not os.path.exists(self.last_progress_log):
                print("Progress log file not found")
                return None

            with open(self.last_progress_log, 'r', encoding='utf-8') as f:
                # 모든 줄을 읽어서 리스트로 저장
                lines = f.readlines()
                
                # 마지막 줄부터 역순으로 읽기
                for line in reversed(lines):
                    if "크롤링" in line:
                        # [2024-02-20 14:30:15] IDX: 137198 - 크롤링 성공
                        idx = int(line.split('IDX:')[1].split('-')[0].strip())
                        print(f"마지막 IDX: {idx} 발견")
                        del lines
                        return idx
                        
            print("크롤링 진행 기록이 없습니다")
            return None
            
        except Exception as e:
            print(f"로그 파일 읽기 오류: {e}")
            return None

    # def start_crawling(self, start_idx=137197, end_idx=178959):
    # def start_crawling(self, start_idx=137197, end_idx=137199):
    def start_crawling(self, start_idx=137197, end_idx=137210, save_point=100):
        try:
            last_idx = self.get_last_idx()
            if last_idx:
                start_idx = last_idx + 1
                print(f"IDX {start_idx}부터 크롤링을 재개합니다")
            
            for idx in range(start_idx, end_idx + 1):
                self.crawl_wine_detail(idx)
                
                # 첫 데이터 csv에 저장
                if idx == start_idx and self.wine_data:
                    df = pd.DataFrame(self.wine_data)
                    df.to_csv(self.csv_file_name, encoding='utf-8-sig', index=False, header=True)
                    self.log_progress(idx, "csv 기록 성공")
                    print(f"Successfully record to csv: {idx}")
                    self.wine_data = [] # 리스트 초기화

                # save_point만큼의 데이터를 수집하거나 마지막 데이터인 경우 csv에 기록
                if len(self.wine_data) >= save_point or idx == end_idx:
                    if self.wine_data:  # 데이터가 있는 경우만 저장
                        df = pd.DataFrame(self.wine_data)
                        df.to_csv(self.csv_file_name, encoding='utf-8-sig', mode='a', index=False, header=False)
                        self.log_progress(idx, "csv 기록 성공")
                        print(f"Successfully record to csv: {idx}")
                        self.wine_data = [] # 리스트 초기화
            
            return True
            
        finally:
            self.driver.quit()

    def get_csv_filename(self):
        return self.csv_file_name


def main():
    crawler = Wine21Crawler()
    crawler.start_crawling()
    df = pd.read_csv(crawler.csv_file_name)
    
    print(f"Total wines collected: {len(df)}")


if __name__ == "__main__":
    main()