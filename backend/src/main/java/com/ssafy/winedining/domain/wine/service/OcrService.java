package com.ssafy.winedining.domain.wine.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class OcrService {

    // 글자 추출
    public String extractText(MultipartFile file) throws Exception {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("C:\\OCR\\tessdata"); // tessdata 경로 설정
        tesseract.setLanguage("kor+eng"); // 한글+영어[숫자는 자동]
        tesseract.setPageSegMode(6); // 6: 단락분석, 3: 완전한 페이지 분석, 1: 자동 레이아웃 감지

        File convFile = new File("C:\\OCR\\temp\\" + file.getOriginalFilename());
        file.transferTo(convFile);

        try {
            return tesseract.doOCR(convFile);
        } catch (TesseractException e) {
            throw new Exception("OCR Processing Failed", e);
        } finally {
            if (convFile.exists()) {
                convFile.delete();
            }
        }
    }

}