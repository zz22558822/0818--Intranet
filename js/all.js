// 資料存放至 data
let data;

// 廣告文字放的位置
let ADtext;
// 廣告放圖的位置
let ADpoto = 'https://www.adobe.com/tw/express/create/media_127a4cd0c28c2753638768caf8967503d38d01e4c.jpeg?width=400&format=jpeg&optimize=medium';

// 取得今日時間 (含Str轉換)
let date = new Date(); //總時間
let today = date.toISOString().split('T')[0]; //以-分開之日期
let year = date.getFullYear().toString(); //年
let month = date.getMonth().toString(); //月
if (month.length == 1) {
    month = "0" + month
}
let day = date.getDate().toString(); //日
if (day.length == 1) {
    day = "0" + day
}






ADtext = '公告'
ADpoto = '資安系統-黃色透明背景.png'
// --------------------(AXJX)--------------------

// 獲取資料 本地端 JSON檔案
function getData() {
    // 讀取本地之JSON檔 含版本號
    fetch("./announcement.json?version="+(new Date()).getTime())
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (jsondata) {

        data = jsondata

        // 判斷是否進入主頁
        if (typeof indexType != 'undefined') {
            // 渲染資料
            renderData()
            showBox()
        }
    })
}


// --------------------(渲染)--------------------
// 渲染資料用
function renderData() {
    // 空字串放置累加資料
    let str = '';

    // 從資料 累加渲染資料到str
    for (let i = 0; i < data.length; i++) {
        // 判斷是否為主頁
        if (indexType == 'index') {
            // 標題渲染
            str +=`
            <div class='item'>
                <h3>${data[i].title+" - "+data[i].time}</h3>
            `
            // 渲染文字(陣列複數) 並剔除空白
            if (data[i].data != undefined) {    // 剔除不存在
                for (let iT = 0; iT < data[i].data.length; iT++) {
                    if (data[i].data[iT] != '') {    // 剃除空白資料
                        str += `<p>${data[i].data[iT] ? data[i].data[iT] : ''}</p>`
                    }
                }
            }
            // 渲染圖片(陣列複數) 並剔除空白
            if (data[i].img != undefined) {    // 剔除不存在
                for (let iI = 0; iI < data[i].img.length; iI++) {
                    if (data[i].img[iI] != '') {    // 剃除空白資料
                        // 這邊img的 html 有添加防止加載圖片錯誤以及面板上的優化
                        str += `<p><img src="${data[i].img[iI] ? data[i].img[iI] : ""}" alt="" onerror="this.src='images/no-pictures512.png';this.style='width: 128px;border: 0;';this.parentNode.style='padding: 0;';this.onerror=null"></p>`
                    }
                }
            }

            // 附件渲染(陣列複數) 並剔除空白或帶入錯誤
            if (data[i].other != undefined) {    // 剔除不存在
                for (let iX = 0; iX < data[i].other.length; iX++) {
                    if (data[i].other[iX] != '' & data[i].otherName[iX] != '') {    // 剃除空白資料
                        str += `<p><a href="${data[i].other[iX]}" target="_blank" rel="noopener noreferrer"><i class="far fa-file-alt"></i>${data[i].otherName[iX]}</a></p>`
                    }
                }
            }

            // 結尾
            str +=`
            </div>
            `
        }
        
    }

    // 貼上到DOM元素
    document.querySelector('.item-list').innerHTML = str;

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


//漢堡選單
$('.hamburger a').click(function (e) { 
    e.preventDefault();
    $(this).toggleClass('fa-bars').toggleClass('fa-times').parent().siblings('.menu').toggleClass('meun-open');
    // $('.footer').toggleClass('menuFixed') //將表尾至頂
    // 增加防止背景滾動的方法 overflow: hidden
    document.querySelector('body').classList.toggle('AD-NoBar');
    // 開啟選單時占據高度100%
    document.querySelector('.header').classList.toggle('meun-open');

    
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

// 折疊選單
function showBox() {
    $(document).ready(function () {
        $('.container .item-list .item h3').click(function (event) {
        //預設效果無效化
        event.preventDefault();
        //點擊的h3.到父層.的子層(p).開關淡入淡出(300毫秒).到父層.其餘同層的.子層(p).隱藏(300毫秒)
        $(this).parent().find('p').slideToggle(300).parent().siblings().find('p').slideUp(300);

        // 新增其餘標籤的隱藏
        //點擊的h3.到父層.的子層(p).開關淡入淡出(300毫秒).到父層.其餘同層的.子層(p).隱藏(300毫秒)
        $(this).parent().find('ol').slideToggle(300).parent().siblings().find('ol').slideUp(300);

        //點擊的h3.開關class屬性.到父層.其餘同層的.子層(h3).移除class屬性
        $(this).toggleClass('item-open').parent().siblings().find('h3').removeClass('item-open');
        });
    });
}



// 刷新手法
// setInterval("ad()","10000");
// setInterval("getData()","10000");


// 初始化
function __init__() {
    // 獲取資料 AXJX
    getData();
    // // 將畫面到到最上方
    // $('html,body').animate({
    //     scrollTop: 0
    // },250);
    // 渲染後期添加的分機表
    phone();
    // 渲染廣告視窗
    ad();
    // 選單開啟
    showBox()
}

__init__()
