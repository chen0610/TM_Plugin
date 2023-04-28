// ==UserScript==
// @name         腾讯广告助手
// @version      0.1
// @description  腾讯广告一些便捷操作
// @author       Longway
// @match        https://e.qq.com/ams/agency/*
// @match        https://ad.qq.com/atlas/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==
(function(){
    'use strict';
    var current_url = document.URL
    //页面添加操作面板
    var panel = '<div class="z_panel"> \
                    <ul>\
                        <li id="b" onClick="filterMine1()">筛选清兄账号</li> \
                        <li id="a" onClick="filterMine()">筛选建聪账号</li> \
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
    var ids_b = "  \
                29626227,  \
                27139498,  \
                27020194,  \
                29626122,  \
                29585585,  \
                27078870,  \
                27014719,  \
                27127842,  \
                26996279,  \
                26776193,  \
                26869164,  \
                27127843,  \
                29532577,  \
                29626261,  \
                26937759,  \
                27014720,  \
                26396256,  \
                29628396,  \
                26924690,  \
                26634187,  \
                27195721,  \
                27127846   \
                "
    //根据url显示不同功能
    function handleUrl(){
        if(current_url.indexOf("advertiser-list/") != -1){
            GM_log('账户列表页面')
        }
        if(current_url.indexOf("advertising/") != -1){
            GM_log('投放广告页面')
            setTimeout(()=>{
                $(".base-page").append(panel)
                GM_log('添加投放广告页面按钮成功！！')
                //筛选建聪账号
                unsafeWindow.filterMine = function() {
                    var uri = current_url.split('?')[0]
                    var str = getQueryString("params")
                    var params = eval('(' + str + ')')
                    params['uid_list'] = ids
                    params = JSON.stringify(params)
                    GM_log(params)
                    var url = uri + '?params=' + params
                    window.location.href = url
                };
                document.getElementById('a').onclick = 'window.filterMine()'
                //筛选清兄账号
                unsafeWindow.filterMine1 = function() {
                    var uri = current_url.split('?')[0]
                    var str = getQueryString("params")
                    var params = eval('(' + str + ')')
                    params['uid_list'] = ids_b
                    params = JSON.stringify(params)
                    GM_log(params)
                    var url = uri + '?params=' + params
                    window.location.href = url
                };
                document.getElementById('b').onclick = 'window.filterMine1()'

            },3000)

        }
        if(current_url.indexOf("admanage/campaign") != -1){
            GM_log('账户推广计划页面')
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