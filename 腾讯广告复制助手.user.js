// ==UserScript==
// @name         腾讯广告复制助手
// @version      0.2
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
    //设置条数
    var num = 20
    //页面添加操作面板
    var panel = '<div class="z_panel"> \
                    <ul>\
                        <li onClick="goCopy()">批量复制'+num+'条</li> \
                    </ul>\
                </div>'
    
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
        //筛选广告复制页面
        if(current_url.indexOf("/create?id=") != -1){
            $('body').append(panel)
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
            unsafeWindow.goCopy = function() {
                //开始复制
                GM_log('###开始执行复制###')
                if(copy_options == ''){
                    unsafeWindow.alert('###没有获取到数据包！请先提交复制一条数据###')
                    return false
                }
                var copy_options1 = JSON.parse(copy_options)
                GM_log('数据',copy_options1)
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
                                GM_log(response.response)
                                if(i == num){
                                    let result = '复制'+num+'条完毕！'
                                    // GM_log(result)
                                    unsafeWindow.alert(result)
                                }
                            }else{
                                GM_log("无结果",response)
                            }
                        },
                    });
                    
                }
                
            }

        }
    }

    handleCopy()


    GM_addStyle ( `
        .z_panel{
            position:fixed;
            top:120px;
            right:0px;
            padding:5px;
            z-index:99999
        }
        .z_panel ul{

        }
        .z_panel ul li{
            width: 100px;
            height: auto;
            text-align: center;
            padding: 5px;
            margin:5px 0;
            background: #296bef;
            color: #fff;
            cursor:pointer
        }
        .z_panel ul li:hover{
            background:#4b7ee3;
        }
    ` );



})();