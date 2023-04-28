// ==UserScript==
// @name         腾讯广告复制助手
// @version      0.1
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

    //页面添加操作面板
    var panel = '<div class="z_panel"> \
                    <ul>\
                        <li id="b" onClick="goCopy()">批量复制30条</li> \
                    </ul>\
                </div>'
    //我的广告主id
    var ids = "  \
                30990983,\
                30911123,\
                30842261,\
                30842260,\
                30990940,\
                30809538,\
                30842256,\
                31298983,\
                30990936,\
                31226956,\
                31298988,\
                30842263,\
                30864410,\
                30990977,\
                31226955,\
                31226957,\
                31037142,\
                30911562,\
                31226954,\
                30911563,\
                30477625,\
                30477603,\
                30185376,\
                30503016,\
                29936800,\
                30503089,\
                29936638,\
                29951862,\
                30508959,\
                31340191,\
                31345480,\
                31340704,\
                31342148  \
                "
    var copy_options = {}
    //根据url显示不同功能
    function handleUrl(){
        //获取广告组id
        var g_tk =''
        var mp_tk =''
        var owner = ''
        var advertiser_id = ''
        var trace_id = ''
        var g_trans_id = ''
        GM_log('网址拆分',current_url)
        if(current_url.indexOf("/create?id=") != -1){
            $('body').append(panel)
            GM_log('广告创建页面')
            // const originOpen = XMLHttpRequest.prototype.open;
            // // GM_log('originOpen',originOpen)
            // originOpen = function (_, url) {
            //     GM_log('网址',url)
            // };
            const originOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open = function (_, url) {
                if(url.indexOf('/order/create') != -1){
                    var url_arr = url.split('?')[1]
                    var url_arr1 = url_arr.split('&')
                    GM_log('url_arr1 ',url_arr1)
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
                    // let uurl = "https://ad.qq.com/ap/order/create?g_tk="+g_tk+"&mp_tk="+mp_tk+"&owner="+owner+"&advertiser_id="+advertiser_id+"&trace_id="+trace_id+"&g_trans_id="+g_trans_id+"&unicode=1&post_format=json"
                    // GM_log('捕获成功',uurl)
                    XMLHttpRequest.prototype.send = function (body) {
                        // let options = JSON.parse(body)
                        //判断数组是否存在dynamic_creative_list和create_time
                        if(body.indexOf('dynamic_creative_list') != -1 && body.indexOf('create_time') == -1){
                            // GM_log('有包含！',body)
                            copy_options = body
                        }
                        // GM_log('捕获成功BODY！',options['dynamic_creative_list'])
                        this.mySend(body);
                    };
                }

                originOpen.apply(this, arguments);
            };
            unsafeWindow.goCopy = function() {
                //开始复制
                GM_log('开始复制~~~~')
                var copy_options1 = JSON.parse(copy_options)
                var old_name = copy_options1.adgroup.adgroup_name
                // XMLHttpRequest.prototype.send(data)
                var r_url = "https://ad.qq.com/ap/order/create?g_tk="+g_tk+"&mp_tk="+mp_tk+"&owner="+owner+"&advertiser_id="+advertiser_id+"&trace_id="+trace_id+"&g_trans_id="+g_trans_id+"&unicode=1&post_format=json"
                for(let i=1;i<11;i++){
                    copy_options1.adgroup.adgroup_name = old_name +'-复制' + i
                    // GM_log('格式化',copy_options1.adgroup.adgroup_name)
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
                                GM_log(response.response)
                                // let r = response.response
                                // if(r.errCode == 0){
                                //     let totalCount = r.data.totalCount
                                //     let lists = r.data.list
                                //     let ids = []
                                //     for (var i = 0; i < lists.length; i++) {
                                //         ids.push(lists[i].objectId)
                                //     }
                                //     GM_setValue("ids", ids)
                                // }else{
                                    
                                //     GM_log(r.errMsg)
                                // }
                            }else{
                                GM_log("无结果",response)
                            }
                        },
                    });
                    if(i == 11){
                        GM_log('复制11条完毕！')
                        unsafeWindow.alert('成功复制40条！')
                    }
                }
                
            }

        }
    }


    handleUrl()
    //监控网址变化
    window.addEventListener('pushState', function(e) {
        current_url = document.URL
        // GM_log('网址改变了',current_url)
        handleUrl()
    });
    //url参数获取
    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        };
        return null;
    }

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