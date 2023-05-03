// ==UserScript==
// @name         腾讯广告复制助手
// @version      0.21
// @description  腾讯广告复制助手
// @author       Longway
// @match        https://ad.qq.com/atlas/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==
(function(){
    'use strict';
    var current_url = document.URL
    //设置快捷条数
    var num = 20
    //设置自定义复制默认条数
    var customNum = 100
    //页面添加操作面板
    var panel = `<div class="op_panel"> 
                    <ul>
                        <li>
                            <button onClick="goCopy()" class="op_btn">快捷复制`+num+`条</button>
                        </li> 
                        <li> 
                            <input type="number" id="CustomNum" placeholder="输入复制条数" />
                            <button class="op_btn" onClick="goCustomCopy()">自定义复制</button>
                        </li>
                    </ul>
                </div>`
    var log_panel = `<div class="log_panel"> 
                        <div class="log_label">
                            <div onClick="openP()">复制日志</div> 
                            <div onClick="closeP()" class="closeP">▼</div></div> 
                        <div class="log_content">
                        </div> 
                    </div>`
    
    //根据url显示不同功能
    function handleCopy(){
        //请求参数
        var copy_options = ''
        //url携带参数初始化
        var g_tk =''
        var mp_tk =''
        var owner = ''
        var advertiser_id = ''
        var trace_id = ''
        var g_trans_id = ''
        //复制累计值
        var total = 0
        //自定义复制累计值
        var custom_total = 0
        //筛选广告复制页面
        if(current_url.indexOf("/create?id=") != -1){
            $('body').append(panel)
            $('body').append(log_panel)
            GM_log('打开了广告复制页面！')
            const originOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open = function (_, url) {
                if(url.indexOf('/order/create') != -1){
                    var url_arr = url.split('?')[1]
                    var url_arr1 = url_arr.split('&')
                    // 提取网址参数
                    for(let i in url_arr1) {
                        let v = url_arr1[i]
                        if(v.indexOf('g_tk=') != -1){
                            g_tk = v.split('=')[1]
                        }else if(v.indexOf('mp_tk=')!= -1){
                            mp_tk = v.split('=')[1]
                        }else if(v.indexOf('owner=')!= -1){
                            owner = v.split('=')[1]
                        }else if(v.indexOf('advertiser_id=')!= -1){
                            advertiser_id = v.split('=')[1]
                        }else if(v.indexOf('trace_id=')!= -1){
                            trace_id = v.split('=')[1]
                        }else if(v.indexOf('g_trans_id=')!= -1){
                            g_trans_id = v.split('=')[1]
                        }
                    }
                    XMLHttpRequest.prototype.send = function (body) {
                        //判断数组是否存在creatives和create_time，有creatives无create_time为所需
                        if(body.indexOf('creatives') != -1 && body.indexOf('create_time') == -1){
                            copy_options = body
                            // GM_log('获取到body',body)
                        }
                        this.mySend(body);
                    };
                }

                originOpen.apply(this, arguments);
            };
            unsafeWindow.openP = function() {
                $('.log_content').css({'display':'block',"transition":"all 500ms;"})
            }
            unsafeWindow.closeP = function() {
                $('.log_content').css({'display':'none',"transition":"all 500ms;"})
            }
            unsafeWindow.goCopy = function() {
                // $('.log_label').css('background-color','#ff0000')
                if(copy_options == ''){
                    unsafeWindow.alert('###没有获取到数据包！请先提交复制一条数据###')
                    return false
                }
                //开始复制
                $(".op_btn").attr('disabled',true) //防止多次点击
                if($('.log_content p').length > 300){
                    $('.log_content').empty()
                }
                $('.log_panel').css({'display':'block'})
                $('.log_content').prepend('<p>••••••</p><p>###开始执行复制###</p>')

                var copy_options1 = JSON.parse(copy_options)
                GM_log('请求数据包',copy_options1)
                var old_name = copy_options1.adgroup.adgroup_name
                var r_url = "https://ad.qq.com/ap/order/create?g_tk="+g_tk+"&mp_tk="+mp_tk+"&owner="+owner+"&advertiser_id="+advertiser_id+"&trace_id="+trace_id+"&g_trans_id="+g_trans_id+"&unicode=1&post_format=json"
                for(let i=1;i<=num;i++){
                    let sn = 0
                    total += 1
                    if(total < 10){
                        //补0
                        sn = '0' + total
                    }else{
                        sn = total
                    }
                    
                    copy_options1.adgroup.adgroup_name = old_name +'-副本' + sn
                    let data = JSON.stringify(copy_options1)
                    setTimeout(() => {
                        GM_xmlhttpRequest({
                            url: r_url,
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                            },
                            data:data,
                            responseType: "json",
                            onload(response) {
                                if ((response.status >= 200 && response.status < 300) || response.status == 304) {
                                    GM_log('当前序号',i)
                                    let res = response.response
                                    GM_log('res',res)
                                    if(res["code"] == 0){
                                        $('.log_content').prepend(`<p>#第`+i+`条数据复制完毕！</p>`)
                                    }else{
                                        let msg = '未知错误!'
                                        switch (res["code"]) {
                                            case 25101:
                                                msg = '复制操作太频繁，稍后再试！'
                                                break;
                                            default:
                                                break;
                                        }
                                        let err_msg = `复制第`+i+`条错误【`+ res["code"] +`】,`+ msg
                                        $('.log_content').prepend(`<p class="red">#`+err_msg+`</p>`)
                                    }
                                    
                                    if(i == num && res["code"] == 0){
                                        setTimeout(() => {
                                            let result = '复制'+num+'条完毕！！！'
                                            $('.log_content').prepend(`<p>=================</p><p class="yellow">##`+result+`</p>`)
                                        }, 1000);
                                        // GM_log(result)
                                        // unsafeWindow.alert(result)
                                    }
                                    $(".op_btn").attr('disabled',false) 
                                }else{
                                    GM_log("无结果",response)
                                }
                            },
                        });
                    }, i*150);
                    
                    
                }
                
            }
            //自定义复制
            unsafeWindow.goCustomCopy = function() {
                customNum = $('#CustomNum').val()
                let step = 2000 //复制时间间隔,默认2秒
                // GM_log('输入框的值',customNum)
                if(copy_options == ''){
                    unsafeWindow.alert('###没有获取到数据包！请先提交复制一条数据###')
                    return false
                }
                //开始复制
                $(".op_btn").attr('disabled',true) //防止多次点击
                $('.log_panel').css({'display':'block'})
                if($('.log_content p').length > 300){
                    $('.log_content').empty()
                }
                $('.log_content').prepend(`<p>••••••</p><p>###开始执行自定义复制`+customNum+`条###</p>`)
                var copy_options1 = JSON.parse(copy_options)
                GM_log('请求数据包',copy_options1)
                var old_name = copy_options1.adgroup.adgroup_name
                var r_url = "https://ad.qq.com/ap/order/create?g_tk="+g_tk+"&mp_tk="+mp_tk+"&owner="+owner+"&advertiser_id="+advertiser_id+"&trace_id="+trace_id+"&g_trans_id="+g_trans_id+"&unicode=1&post_format=json"
                
                for(let i=1;i<=customNum;i++){
                    let sn = 0
                    custom_total += 1
                    if(custom_total < 10){
                        //补0
                        sn = '0' + custom_total
                    }else{
                        sn = custom_total
                    }
                    copy_options1.adgroup.adgroup_name = old_name +'-副本' + sn
                    let data = JSON.stringify(copy_options1)
                    setTimeout(() => {
                        GM_xmlhttpRequest({
                            url: r_url,
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                            },
                            data:data,
                            responseType: "json",
                            onload(response) {
                                if ((response.status >= 200 && response.status < 300) || response.status == 304) {
                                    GM_log('当前序号',i)
                                    let res = response.response
                                    GM_log('res',res)
                                    if(res["code"] == 0){
                                        $('.log_content').prepend(`<p>#第`+i+`条数据复制完毕！</p>`)
                                    }else{
                                        let msg = '未知错误!'
                                        switch (res["code"]) {
                                            case 25101:
                                                msg = '复制操作太频繁，稍后再试！'
                                                break
                                            case 1530000:
                                                msg = '创意服务系统繁忙，请稍后重试!'
                                                break
                                            case 36705:
                                                msg = '系统繁忙，请稍后重试!'
                                                break
                                            case 40531:
                                                msg = '广告名称已存在'
                                            default:
                                                break
                                        }
                                        let err_msg = `复制第`+i+`条错误【`+ res["code"] +`】,`+ msg
                                        $('.log_content').prepend(`<p class="red">#`+err_msg+`</p>`)
                                    }
                                    
                                    if(i == customNum && res["code"] == 0){
                                        setTimeout(() => {
                                            let result = '复制'+customNum+'条完毕！！！'
                                            $('.log_content').prepend(`<p>=================</p><p class="yellow">##`+result+`</p>`)
                                        }, 1000);
                                    }
                                    if(i == customNum ){
                                        $(".op_btn").attr('disabled',false)
                                    }
                                }else{
                                    GM_log("无结果",response)
                                }
                            },
                        });
                    }, i*step);
                }
            }

        }
    }

    handleCopy()


    GM_addStyle ( `
        .op_panel{
            position:fixed;
            top:120px;
            right:0px;
            padding:5px;
            z-index:99999
        }
        .op_panel ul{

        }
        .op_panel ul li{
            width: 140px;
            height: auto;
            text-align: center;
            padding: 10px;
            margin:5px 0;
            background: #fff;
            box-shadow:1px 1px 5px #c1c4d1;
            color: #fff;
            border-radius:5px;
        }
        .op_panel ul li input{
            width:120px;
            margin:0 auto;
            border:1px solid #e5e5e5;
        }
        .op_btn{
            width: 120px;
            height: auto;
            text-align: center;
            padding: 5px 10px;
            margin:5px auto;
            background: #296bef;
            color: #fff;
            cursor:pointer;
            border-radius:5px;
        }
        .op_btn:hover{
            background:#4b7ee3;
        }
        .log_panel{
            display:none;
            position:fixed;
            bottom:0px;
            right:0px;
            width:250px;
            z-index:99999
        }
        .log_label {
            display: block;
            padding: 0 20px;
            height: 40px;
            background-color: #202020;
            cursor: pointer;
            line-height: 40px;
            font-size: 16px;
            color: #fff;
        }
        .log_label div{
            display:inline-block
        }
        .closeP{
            float:right
        }
        .log_content{
            overflow-y:scroll;
            color:#fff;
            background-color:#0c0c0c;
            height:300px;
            padding: 0 20px;
        }
        .log_content p{
            color:#fff;
            margin: 5px 0;
            transition: all 500ms;
            word-wrap:break-word;
        }
        .red{
            color:#ff0000 !important
        }
        .yellow{
            color:#f7de54 !important;
            font-size:14px
        }
    ` );



})();