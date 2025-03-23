package com.ssafy.winedining.domain.recommend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recommend")
@RequiredArgsConstructor
public class RecommController {

    /**
     *
     *
     */
    @PostMapping("/test")
    public  registerRecommTest(){
        return RegisterRecommTestResponse registerRecommTestResponse;
    }

//    /**
//     *
//     *
//     */
//    @GetMapping("/")
//    public
//
//    @GetMapping("/master/week")
//    public
//
//
//    @GetMapping("/master")
//    public







}
