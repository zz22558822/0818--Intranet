// 資料存放至 data
let data;

// 當前QA的位置
let QAtype;

// 廣告文字放的位置
let ADtext;
// 廣告放圖的位置
let ADpoto = 'https://www.adobe.com/tw/express/create/media_127a4cd0c28c2753638768caf8967503d38d01e4c.jpeg?width=400&format=jpeg&optimize=medium';

ADtext = '公告'
ADpoto = '資安系統-黃色透明背景.png'
// --------------------(AXJX)--------------------

// 獲取資料 本地端 JSON檔案
function getData() {
    // 讀取本地之JSON檔
    fetch("./QAdata.json")
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (jsondata) {

        data = jsondata

        // 判斷是否進入個別的QA頁面
        if (QAtype != undefined) {
            // 渲染資料
            renderData()
            QA()
        }
    })
}


// --------------------(渲染)--------------------
// 渲染資料用
function renderData() {
    // 空字串放置累加資料
    let str = '';
    // 從全部資料 累加渲染資料到str
    for (let i = 0; i < data.length; i++) {
        // 判斷是否為當前頁面的資料分類
        if (QAtype == data[i].type) {
            str +=`
            <div class="question">
                <h3>${data[i].dataQ}</h3>
                <p>
                    ${data[i].dataA ? data[i].dataA : ''}

                    ${data[i].other ? `<a href='${data[i].other}' target='_blank'>連結點我</a>` : ''}
                </p>
            </div>
            `
        }
    }
    // 貼上到DOM元素
    document.querySelector('.question-list').innerHTML = str;
}





// 使用 JQuery 的部分
$(document).ready(function () {
    // TOP按鈕
    $('.top-btn a').click(function (e) { 
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        },350);
    });
});

function QA() {
    //Q & A折疊選單
    $(document).ready(function () {
        $('.question h3').click(function (event) {
        //預設效果無效化
        event.preventDefault();
        //點擊的h3.到父層.的子層(p).開關淡入淡出(300毫秒).到父層.其餘同層的.子層(p).隱藏(300毫秒)
        $(this).parent().find('p').slideToggle(300).parent().siblings().find('p').slideUp(300);
        //點擊的h3.開關class屬性.到父層.其餘同層的.子層(h3).移除class屬性
        $(this).toggleClass('question-open').parent().siblings().find('h3').removeClass('question-open');
        });
    });
}


//漢堡選單
$('.hamburger a').click(function (e) { 
    e.preventDefault();
    $(this).toggleClass('fa-bars').toggleClass('fa-times').parent().siblings('.menu').toggleClass('meun-open');
});


// 後來添加 只好使用渲染方式加上分機表
function phone(){
    document.querySelector('.footer').innerHTML = `<h3>Copyright © 2022 Avertronics Inc.</h3><a class="phoneTable" href="http://iswd.avertronics.com/staff/download/HR/telphonetable.xls" target="_blank">電話分機表</a>`
}
// 後來添加 用來增加AD廣告表
function ad() {
    // 判斷廣告框存不存在於 Html 當中
    if (document.querySelector('.AD-Box') != null){
        // 增加防止背景滾動的方法 overflow: hidden
        document.querySelector('body').classList.add('AD-NoBar');
        // 圖片 判斷是否為 對外連結，如不是，改用images內的檔案 並確認是否已添加 images
        if (ADpoto.substring(0, 4) != 'http' && ADpoto.substring(0, 9) != './images/') {
            // 內部 使用 images
            ADpoto = './images/'+ADpoto
        }
        // 更改參數 ADtext 即可達到顯示的效果
        document.querySelector('.AD-Box').innerHTML = `<div class='AD-Max'><p class='text'>${ADtext}</p>${ADpoto ? `<img src='${ADpoto}' alt="ADpoto" class="ADpoto">` : ''}<a class="ad-close" href="#">×</a></div>`
        // 如果廣告內為空白，則用Jqery的hide隱藏廣告框
        if (document.querySelector('.text').innerText == '' || document.querySelector('.text').innerText == "undefined"){
            // 後背景改為全透明
            document.querySelector('.AD-Box').classList.add('AD-BGno');
            $('.AD-Box').hide(0);
        }else{
            document.querySelector('.ad-close').addEventListener('click',ADClose)
            // 後背景改為半透明
            document.querySelector('.AD-Box').classList.remove('AD-BGno');
            $('.AD-Box').show(300);
        }
    }
}
// 廣告關閉鈕
$(document).ready(function () {
    $('.ad-close').click(function (e) { 
        e.preventDefault();
        // 後背景改為全透明
        document.querySelector('.AD-Box').classList.add('AD-BGno');
        document.querySelector('body').classList.remove('AD-NoBar');
        $('.AD-Box').hide(500);
    });
});
function ADClose(e){
    e.preventDefault();
    // 後背景改為全透明
    document.querySelector('.AD-Box').classList.add('AD-BGno');
    document.querySelector('body').classList.remove('AD-NoBar');
    $('.AD-Box').hide(500);
}
// 廣告 快捷切換並渲染
function ADswitch(text,img) {
    // 參數1 文字檔案
    ADtext = text;
    // 參數2 圖片 判斷是否為 對外連結，如不是，改用images內的檔案
    if (img.substring(0, 4) == 'http') {
        // 外部 使用連結
        ADpoto = img
    }else{
        // 內部 使用 images
        ADpoto = './images/'+img
    }
    ad();
}

// 更新 AD、QA的手法
// setInterval("ad()","10000");
setInterval("getData()","10000");


// 初始化
function __init__() {
    // 獲取資料 AXJX
    getData();
    // 將畫面到到最上方
    $('html,body').animate({
        scrollTop: 0
    },250);
    // 渲染後期添加的分機表
    phone();
    // 渲染廣告視窗
    ad();
}

__init__()
