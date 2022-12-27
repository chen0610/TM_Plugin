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
                        <li id="a" onClick="filterMine()">筛选我的</li> \
                        <li>筛选我的2</li> \
                    </ul>\
                </div>'
    //我的广告主id
    var ids = "29626424, \
                29626341, \
                29626328, \
                29626294, \
                29585586, \
                29585584, \
                29585583, \
                29585581, \
                29546080, \
                29515640, \
                29515633, \
                27195720, \
                27195719, \
                27172119, \
                27139497, \
                27127846, \
                27127845"
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
                
                //筛选我的
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