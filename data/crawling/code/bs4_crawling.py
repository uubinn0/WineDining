import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os
from urllib.parse import urlparse
import concurrent.futures
from datetime import datetime

class Wine21FastCrawler:
    def __init__(self):
        # 기본 설정
        self.base_url = "https://www.wine21.com/13_search/wine_view.html?Idx={}&lq=LIST"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G988B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
        }
        self.wine_data = []
        
        # 크롤링 횟차 입력
        crawl_count = int(input("크롤링 횟차를 입력하세요: "))
        
        # 디렉토리 및 파일 설정
        self.setup_directories(crawl_count)
        
    def setup_directories(self, crawl_count):
        # 디렉토리 생성
        self.image_dir = f'../data/image/{crawl_count}/'
        os.makedirs(self.image_dir, exist_ok=True)
        os.makedirs('../log', exist_ok=True)
        os.makedirs('../data/wine', exist_ok=True)
        
        # 파일 경로 설정
        self.progress_log = f"../log/progress_log_{crawl_count}.txt"
        self.csv_file_name = f"../data/wine/wine21_data_{crawl_count}.csv"
        self.error_log = '../log/download_errors.txt'
        self.last_progress_log = f"../log/progress_log_{crawl_count-1}.txt" if crawl_count > 1 else self.progress_log

    def log_message(self, file_path, idx, message):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] IDX: {idx} - {message}\n")

    def download_image(self, image_url, idx):
        if not image_url or 'no_image2.jpg' in image_url:
            return 'no_image'
            
        try:
            ext = os.path.splitext(urlparse(image_url).path)[1] or '.png'
            filename = f'{idx}{ext}'
            filepath = os.path.join(self.image_dir, filename)
            
            response = requests.get(image_url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                return filename
        except Exception as e:
            self.log_message(self.error_log, idx, f"이미지 다운로드 실패: {str(e)}")
        return None

    def parse_food_categories(self, soup):
        food_categories = []
        food_mapping = {
            'food-cow': '소고기', 'food-pig': '돼지고기', 'food-chicken': '닭/오리',
            'food-sheep': '양고기', 'food-fish': '생선', 'food-chellfish': '해산물',
            'food-dry': '건육', 'food-salami': '건육', 'food-salad': '채소/샐러드',
            'food-fried': '튀김', 'food-cheese': '치즈', 'food-fruit': '과일/건과일',
            'food-raisin': '과일/건과일', 'food-cake': '디저트', 'food-bibimbap': '한식',
            'food-asia': '중식', 'food-pizza': '양식', 'food-noodle': '아시아음식',
            'food-walnut': '견과'
        }
        
        food_images = soup.select('ul.clear.swiper-wrapper li em img')
        for img in food_images:
            src = img.get('src', '')
            for key, value in food_mapping.items():
                if key in src:
                    food_categories.append(value)
                    break
                    
        return ', '.join(set(food_categories)) if food_categories else None

    def get_wine_type(self, soup):
        type_mapping = {
            'bagde-red-fill': '레드',
            'bagde-blue-fill': '화이트',
            'bagde-yellow-fill': '스파클링',
            'bagde-rose-fill': '로제'
        }
        
        for badge in soup.select('span.bagde-item'):
            class_name = badge.get('class', [])
            for key, value in type_mapping.items():
                if key in class_name:
                    return value
        return None

    def get_gauge_value(self, soup, component_name):
        try:
            components = soup.select('.wine-components li')
            for comp in components:
                if comp.select_one('.wine-c-txt').text.strip() == component_name:
                    return len(comp.select('a.on'))
        except:
            pass
        return None

    def clean_price(self, price_elem):
        if not price_elem:
            return None
        
        try:
            # 가격정보없음 체크
            if 'wine-price-none' in price_elem.get('class', []):
                return None
            
            price_text = price_elem.text.strip()
            # 숫자만 추출 (예: "220,000원" -> "220000")
            return int(price_text.replace(',', '').replace('원', '').strip())
        except:
            return None

    def get_alcohol_content(self, soup):
        try:
            # wine-d-box-info-list 내의 모든 dl 요소들을 찾음
            dl_elements = soup.select('div.wine-d-box-info-list dl')
            
            for dl in dl_elements:
                dt = dl.select_one('dt')
                if dt and '알코올' in dt.text:  # dt 태그에 '알코올' 텍스트가 있는지 확인
                    dd = dl.select_one('dd')
                    if dd:
                        # % 기호 제거하고 숫자만 추출 (예: "14~15 %" -> "14~15")
                        alcohol = dd.text.replace('%', '').strip()
                        return alcohol
            return None
        except Exception as e:
            print(f"알코올 도수 추출 중 에러 발생: {str(e)}")
            return None

    def crawl_wine_detail(self, idx):
        try:
            response = requests.get(self.base_url.format(idx), headers=self.headers, timeout=10)
            if not response.ok:
                self.log_message(self.progress_log, idx, f"HTTP 에러: {response.status_code}")
                return None
                
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 와인 정보가 없는 경우 체크
            if "와인정보가 검색되지 않았습니다" in response.text:
                self.log_message(self.progress_log, idx, "와인 정보 없음")
                return None
                
            # 기본 정보 추출
            wine_name = soup.select_one('dt.wine-name')
            if not wine_name:
                self.log_message(self.progress_log, idx, "와인 정보 없음")
                return None
                
            # 이미지 처리
            image_url = None
            img_elem = soup.select_one('.swiper-slide img')
            if img_elem:
                image_url = img_elem.get('src')
            local_image = self.download_image(image_url, idx)
            
            # 가격 추출 부분 수정
            price_elem = soup.select_one('p.wine-price strong')
            price = self.clean_price(price_elem)
            
            # 와인 정보 수집
            wine_info = {
                'idx': idx,
                'kr_name': wine_name.text.strip() if wine_name else None,
                'en_name': soup.select_one('dd.wine-name-en').text.strip() if soup.select_one('dd.wine-name-en') else None,
                '와인_이미지_URL': image_url,
                '와인_이미지_파일명': local_image,
                'country': soup.select_one('p.dib span:nth-child(2)').text.strip() if soup.select_one('p.dib span:nth-child(2)') else None,
                'grape': soup.select_one('h4.wine-name a').text.strip() if soup.select_one('h4.wine-name a') else None,
                'price': price,
                'sweetness': self.get_gauge_value(soup, '당도'),
                'acidity': self.get_gauge_value(soup, '산도'),
                'tannin': self.get_gauge_value(soup, '타닌'),
                'body': self.get_gauge_value(soup, '바디'),
                'alcohol_content': self.get_alcohol_content(soup),
                'type': self.get_wine_type(soup),
                'pairing': self.parse_food_categories(soup)
            }
            
            self.log_message(self.progress_log, idx, "크롤링 성공")
            return wine_info
            
        except Exception as e:
            self.log_message(self.progress_log, idx, f"크롤링 실패: {str(e)}")
            return None

    def process_chunk(self, start_idx, end_idx):
        chunk_data = []
        for idx in range(start_idx, end_idx + 1):
            wine_info = self.crawl_wine_detail(idx)
            if wine_info:
                chunk_data.append(wine_info)
            time.sleep(0.1)  # 서버 부하 방지
        return chunk_data

    def start_crawling(self, start_idx=137197, end_idx=178959, chunk_size=100, max_workers=4):
        try:
            # 마지막 인덱스 확인
            last_idx = self.get_last_idx()
            if last_idx:
                start_idx = last_idx + 1
                print(f"IDX {start_idx}부터 크롤링을 재개합니다")

            # 청크 단위로 처리
            chunks = [(i, min(i + chunk_size - 1, end_idx)) 
                     for i in range(start_idx, end_idx + 1, chunk_size)]
            
            all_data = []
            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                future_to_chunk = {executor.submit(self.process_chunk, chunk[0], chunk[1]): chunk 
                                 for chunk in chunks}
                
                for future in concurrent.futures.as_completed(future_to_chunk):
                    chunk_data = future.result()
                    if chunk_data:
                        all_data.extend(chunk_data)
                        
                        # 청크 단위로 CSV 저장
                        if len(all_data) >= chunk_size:
                            df = pd.DataFrame(all_data)
                            mode = 'w' if not os.path.exists(self.csv_file_name) else 'a'
                            header = not os.path.exists(self.csv_file_name)
                            df.to_csv(self.csv_file_name, mode=mode, encoding='utf-8-sig', 
                                    index=False, header=header)
                            all_data = []
            
            # 남은 데이터 저장
            if all_data:
                df = pd.DataFrame(all_data)
                mode = 'w' if not os.path.exists(self.csv_file_name) else 'a'
                header = not os.path.exists(self.csv_file_name)
                df.to_csv(self.csv_file_name, mode=mode, encoding='utf-8-sig', 
                         index=False, header=header)
            
            return True
            
        except Exception as e:
            print(f"크롤링 중 오류 발생: {str(e)}")
            return False

    def get_last_idx(self):
        try:
            if not os.path.exists(self.last_progress_log):
                return None

            with open(self.last_progress_log, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for line in reversed(lines):
                    if "크롤링 성공" in line:
                        idx = int(line.split('IDX:')[1].split('-')[0].strip())
                        return idx
            return None
            
        except Exception as e:
            print(f"로그 파일 읽기 오류: {str(e)}")
            return None

def main():
    crawler = Wine21FastCrawler()
    success = crawler.start_crawling(
        start_idx=137197,  # 시작 인덱스
        # end_idx=178959,    # 종료 인덱스
        # end_idx=138197,    # 종료 인덱스
        end_idx=137220,    # 종료 인덱스
        chunk_size=100,    # 한 번에 처리할 데이터 크기
        max_workers=4      # 동시 실행할 스레드 수
    )
    
    if success:
        df = pd.read_csv(crawler.csv_file_name)
        print(f"Total wines collected: {len(df)}")
    else:
        print("크롤링이 실패했습니다.")

if __name__ == "__main__":
    main()