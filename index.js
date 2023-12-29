const axios = require("axios");
const ceerio = require("cheerio");
const http = require('http');
const url = require('url');
const fs = require('fs');

//HTML 코드 가져오기
const getHTML = async() => {
    try{
        return await axios.get("https://news.daum.net");
    }catch(err){
        console.log(err);
    }
};

var titleArr = [];

//파싱
const parsing = async()=>{
    const html = await getHTML();
    const $ = ceerio.load(html.data);
    const $titlelist = $(".tit_g");

    $titlelist.each((_,node)=>{
        const title = $(node).find(".link_txt").text();
        titleArr.push(title);
    })

}

parsing();


http.createServer((request, response) => {
    const path = url.parse(request.url, true).pathname;
    
    response.writeHead(200,{'Content-Type':'text/html'});
   
   let data = `
   <!DOCTYPE html> 
        <html lang="en">   
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        </head>
    <body>`;

    data += '<h1>daum news 크롤링 결과</h1>';
    
    data += '<STRONG><ul>';
   titleArr.map((d, idx)=>{
    data += `<li>${idx+1}번째 기사 제목: ${d}</li>`;
   });
   data += '</ul></STRONG>';
   data += '</body>';
    response.end(data, 'utf-8');
    
}).listen(8080);