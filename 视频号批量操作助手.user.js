// ==UserScript==
// @name         博虎视频号快捷助手
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  视频号一些快捷处理
// @author       Longway
// @match        https://channels.weixin.qq.com/platform/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict'
    GM_log("视频号批量操作助手 start")
    var button_delete_all  = '<button type="button" id="removeAll" class="weui-desktop-btn weui-desktop-btn_warn" style="margin-left:20px">一键删除动态</button> \
    <button type="button" id="myselfAll" class="weui-desktop-btn weui-desktop-btn_primary" style="margin-left:20px">一键自己可见</button> \
    <button type="button" id="publicAll" class="weui-desktop-btn green" style="margin-left:20px">一键公开可见</button>'
    // var cookies = document.cookie
    // var json1 = {"pageSize":20,"currentPage":1,"scene":1}
    // GM_log('json1',JSON.stringify(json1))
    var data1 = JSON.stringify({
        "pageSize": 500,
        "currentPage": 1,
        "scene": 1
    });
    setTimeout(()=>{ //延时的目的是让页面先加载完全
        $('.route-name').append(button_delete_all)
        GM_xmlhttpRequest({
            url: "https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_list",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            },
            data:data1,
            responseType: "json",
            onload(response) {
                
                if ((response.status >= 200 && response.status < 300) || response.status == 304) {
                    // GM_log(response.response)
                    let r = response.response
                    if(r.errCode == 0){
                        let totalCount = r.data.totalCount
                        let lists = r.data.list
                        let ids = []
                        for (var i = 0; i < lists.length; i++) {
                            ids.push(lists[i].objectId)
                        }
                        GM_setValue("ids", ids)
                    }else{
                        
                        GM_log(r.errMsg)
                    }
                }else{
                    GM_log("无结果",response)
                }
            },
        });
        var wait_second = 1500  //等待时间
        $("#removeAll").click(function(){
            var r = confirm("确定删除所有视频吗？")
            if (r==true){
                const ids = GM_getValue("ids")
                if(ids.length == 0){
                    //无可进行操作动态时提示
                    alert('没有可以操作的动态！')
                }else{
                    $('#removeAll').attr('disabled',true)
                    ids.forEach(item => {
                        goRemove(item)
                    });
                    //根据条数动态调整延时时间
                    wait_second = wait_second * (parseInt(ids.length/20)+1)
                    setTimeout(()=>{
                        alert('全部删除成功！')
                        location.reload();
                    },wait_second)
                }
                
            }
            
        })
        $("#myselfAll").click(function(){
            var r = confirm("确定全部设置为自己可见吗？")
            if (r==true){
                const ids = GM_getValue("ids")
                if(ids.length == 0){
                    //无可进行操作动态时提示
                    alert('没有可以操作的动态！')
                }else{
                    $('#myselfAll').attr('disabled',true)
                    ids.forEach(item => {
                        goMyself(item)
                    });
                    //根据条数动态调整延时时间
                    wait_second = wait_second * (parseInt(ids.length/20)+1)
                    setTimeout(()=>{
                        alert('设置自己可见成功')
                        location.reload();
                    },wait_second)
                    
                }
                
                
            }
            
        })

        $("#publicAll").click(function(){
            var r = confirm("确定全部设置为公开可见吗？")
            if (r==true){
                const ids = GM_getValue("ids")
                if(ids.length == 0){
                    //无可进行操作动态时提示
                    alert('没有可以操作的动态！')
                }else{
                    $('#publicAll').attr('disabled',true)
                    ids.forEach(item => {
                        goPublic(item)
                    });
                    //根据条数动态调整延时时间
                    wait_second = wait_second * (parseInt(ids.length/20)+1)
                    setTimeout(()=>{
                        alert('设置公开可见成功')
                        location.reload();
                    },wait_second)
                }
                
            }
            
        })

        function goMyself(item){
            let d = JSON.stringify({
                "objectId": item,
                "visibleType": 3
            })
            GM_xmlhttpRequest({
                url: "https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_update_visible",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                },
                data:d
            });
        }
        function goPublic(item){
            let d = JSON.stringify({
                "objectId": item,
                "visibleType": 1
            })
            GM_xmlhttpRequest({
                url: "https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_update_visible",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                },
                data:d
            });
        }
        function goRemove(item){
            let d = JSON.stringify({
                "objectId": item
            })
            GM_xmlhttpRequest({
                url: "https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_delete",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                },
                data:d,
                responseType: "json",
                onload(response) {
                    
                    if ((response.status >= 200 && response.status < 300) || response.status == 304) {
                        GM_log(response.response)
                    }else{
                        GM_log("无结果",response)
                    }
                },
            });
        }

    }, 4000);
    GM_addStyle ( `
        .green { background-color:#07c160;color:#fff}
    ` );
    

})();