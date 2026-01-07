<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
<title>微信开放平台</title>
<script type="text/javascript">
	var Report={
		start:+new Date(),
		point:{}
	}

  window.wx={
    fake_id: '',
    fake_id_open: '',
    data:{
      lang:''||'zh_CN'
    }
  };
</script>
<link rel="shortcut icon" type="image/x-icon" href="https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico">
<link rel="mask-icon" href="https://res.wx.qq.com/a/wx_fed/assets/res/MjliNWVm.svg" color="#4C4C4C">
<link rel="apple-touch-icon-precomposed" href="https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png">
<script type="text/javascript" src="https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/jserr7b3046.js"></script>
<link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/zh_CN/htmledition/res/css/base/lib7b3046.css">
<link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/zh_CN/htmledition/res/css/base/base7b3046.css">
<link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/zh_CN/htmledition/res/css/base/base7b3046.css">
<script type="text/javascript" src="https://res8.wxqcloud.qq.com.cn/obtelemetry/phantom.min.js"></script>
<script>
    window.addEventListener('load', function () {
        window.__obtelemetry_phantom__ && __obtelemetry_phantom__.enable && window.__obtelemetry_phantom__.enable({
            watermarkParams: {
                cookieKey: 'open_obtelemetry',
                refreshStrategy: { interval: 10 }
            },
            wxobsParams: {
                maskMode: 'no-mask', 
                recordCanvas: false,  
                projectId: 'wx15509c451fd2fafa-wEOcfW0rf-CXRP', 
                iframe: false, 
                console: true, 
                network: true, 
            }
        });
    });
</script>

        <link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/zh_CN/htmledition/res/css/page/page_error7b3046.css"/>
        
    </head>

    <body>
        <div class="head">
            <div class="global_bar" id="loginBar">
	<div class="inner wrp">
	    &nbsp;
	    <div class="account" id="loginAccount">
	    				<a href="javascript:void(0);" class="account_meta no_extra" id="loginBarBt">登录</a>
            <a href="javascript:void(0);" id="loginBarRegisterBt">注册</a>
            <a href="javascript:void(0);" id="biz_qrcode_a" class="account_meta extra_info dev_code">
                <img src="https://res.wx.qq.com/open/zh_CN/htmledition/res/img/pic/mp-dev-guide/icon_dev_code7b3045.png" class="icon_devcode">
                <div id="biz_qrcode_div" style="display:none;" class="bubble_tips bubble_top code_pop">
                    <div class="bubble_tips_inner">
                     <p><img src="https://res.wx.qq.com/open/zh_CN/htmledition/res/img/pic/mp-dev-guide/dev_code7b3045.jpg" class="pic_devcode"></p>
                     <p class="txt_enhanced">请扫码关注<br>接收重要通知</p>
                    </div>
                    <i class="bubble_tips_arrow out"></i>
                    <i class="bubble_tips_arrow in"></i>
                 </div>
            </a>
            
            <a href="javascript:;" class="menu_wrps lang_switch"  >
                <div class="menu_container">
                    <div class="menu_placeholder">
                        <i class="pic_lang_switch"></i>
                    </div>
                    
                    <div class="menu_list_wrps" id="jsLangMenu">
                        <div class="menu_list_container">
                            <ul class="menu_list">
                                <li class="menu_list_ele">
                                    <label class="frm_radio_label jsLangLabel">
                                        <i class="icon_radio"></i>
                                        <span class="lbl_content">English</span>
                                        <input type="radio" value="en_US" class="frm_radio jsLangSelect" >
                                    </label>
                                </li>
                                <li class="menu_list_ele">
                                    <label class="frm_radio_label jsLangLabel">
                                        <i class="icon_radio"></i>
                                        <span class="lbl_content">中文（简体）</span>
                                        <input type="radio" value="zh_CN" class="frm_radio jsLangSelect">
                                    </label>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </a>
            
	        	    </div>
	</div>
</div>

<script type="text/html" charset="utf-8" id="loginPop">
<div class="login_panel label_input prepend open" id="{id}" style="margin-top:-300px;">
    <div id="{id}_wx">
        <div class="login_inner wx">
            <form class="form login_form"  id="{id}_form">
                <fieldset class="login_fieldset">
                    <legend class="login_legend">登录</legend>

                    <div class="login_input_area">
                        <span class="login_input_box first">
                            <label class="login_label">邮箱</label>
                            <input type="text" placeholder="请填写登录邮箱" class="frm_input" name="account"></span>
                        <span class="login_input_box last">
                            <label class="login_label">密码</label>
                            <input type="password"  placeholder="请填写密码" class="frm_input" name="passwd"></span>
                    </div>
                    <div class="login_code_area" style="display:none" id="{id}_verifyContainer">
                        <div class="verifycode" id="{id}_verify"></div>
                    </div>

                    <div class="login_function_area">
                        <input type="checkbox" class="frm_checkbox" data-label="记住账号" id="{id}_check">
                        <a href="javascript:void(0);" id="{id}_forget" class="jsUrlLink" data-url="regist/forget">忘记密码</a>
                    </div>

                    <div class="login_valid_area"  id="{id}_fail">

                    </div>

                    <div class="login_tool_area">
                        <a href="javascript:void(0);" class="btn btn_primary btn_login" id="{id}_login">登录</a>
                        <a href="javascript:void(0);" class="btn btn_default btn_regist" id="{id}_regist">注册</a>
                    </div>
                </fieldset>
            </form>

        </div>
        <div class="login_tips wx">
                <p>
                    <i class="icon_login qq"></i>QQ号注册的老用户，<a href="javascript:;" id="{id}_goQQ">点此登录</a>                </p>
        </div>
    </div>

    <div class="login_inner qq" style="display:none;" align="center" id="{id}_qq">
             <legend class="login_legend">登录</legend>
            <iframe src="" frameborder="0" id="{id}_frame"></iframe> 

            <div class="login_tips qq">
                <p>
                    仅供旧注册用户使用，新用户请<a href="javascript:;" id="{id}_goWX">使用邮箱账号注册和登录</a>                </p>
            </div>
    </div>
        <a href="javascript:void(0);" class="login_close icon16_common close " id="{id}_close">关闭</a>
</div>
</script>

        	<div class="head_box">
                <div class="inner wrp">
                    <h1 class="logo">
                        <a href="javascript:;" data-url="home/index" class="jsUrlLink" title="微信开放平台">微信开放平台</a>
                    </h1>
                    <span>
    <ul class="nav">
        <li class="nav_item jsNavItem" data-id="index"><a href="javascript:" class="jsUrlLink" data-url="home/index" target="self">首页</a></li>
        <li class="nav_item jsNavItem" data-id="res"><a href="https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Resource_Center_Homepage.html" target="_blank">资源中心</a></li>
        <li class="nav_item jsNavItem" data-id="manage"><a href="javascript:" class="jsUrlLink" data-login="true" data-url="manage/list" target="self">管理中心</a></li>

        <li class="nav_item jsNavItem" data-id="account"><a href="javascript:" class="jsUrlLink" data-login="true" data-url="setting/dev" target="self">账号中心</a></li>
            
    </ul>
     <div class="encounter_problem" id="online_service">
            <div class="encounter_problem_simple">
                <img src="https://res.wx.qq.com/open/zh_CN/htmledition/res/img/pic/slider/icon_help7b3045.svg" class="encounter_problem_simple_icon" />
                <p class="encounter_problem_simple_word">遇</p>
                <p class="encounter_problem_simple_word">到</p>
                <p class="encounter_problem_simple_word">问</p>
                <p class="encounter_problem_simple_word">题</p>
            </div>
            <div class="encounter_problem_detail">
                <a target="view_window" href="https://developers.weixin.qq.com/console/index?tab1=business&tab2=dev&aibot=1&utm_source=openplateform">
                    <div class="encounter_problem_detail_item">
                        <div class="encounter_problem_detail_item_top">
                            <p class="encounter_problem_detail_item_top_title">问题反馈</p>
                            <img src="https://res.wx.qq.com/open/zh_CN/htmledition/res/img/pic/slider/icon_arrow7b3045.svg" class="encounter_problem_detail_item_top_icon" />
                        </div>
                        <p class="encounter_problem_detail_item_tip">找 AI 助手智能解答</p>
                    </div>
                </a>
                
                <div class="encounter_problem_detail_line"></div>
                <a target="view_window" href="https://mp.weixin.qq.com/webpoc/customerService?type=16&c1=&c2=&c3=">
                    <div class="encounter_problem_detail_item">
                        <div class="encounter_problem_detail_item_top">
                            <p class="encounter_problem_detail_item_top_title">在线客服</p>
                            <img src="https://res.wx.qq.com/open/zh_CN/htmledition/res/img/pic/slider/icon_arrow7b3045.svg" class="encounter_problem_detail_item_top_icon" />
                        </div>
                        <p class="encounter_problem_detail_item_tip">向在线客服咨询问题</p>
                    </div>
                </a>
            </div>
        </div>
</span>

                </div>
            </div> 
        </div>   
        <div class="body">
            <div class="inner wrp">
                <div class="container_box">
                    <div class="page_error_msg">
                        <div class="inner">
                            <span class="icon_wrp">
                                <i class="icon_page_error"></i>
                            </span>
                            <div class="msg_content">
                                
        <h2>页面不存在，请点击<a href="/" class="jsUrlLink">返回首页</a></h2>
	
                            </div>
                        </div>
                    </div>
                </div>   
            </div>   
        </div>   
        
        <div class="foot">
    <div class="inner wrp">
        <p class="copyright">&copy; 1998 - 2026 Tencent All Right Reserved.</p>
        <ul class="ft links">
        	          
        	<li class="links_item no_extra"><a href="/cgi-bin/frame?t=news/protocol_developer_tmpl" target="_blank">开发者协议</a></li>
          <li class="links_item no_extra"><a href="https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&announce_id=1512986091&version=1&lang=zh_CN&platform=2" target="_blank">运营规范</a></li>
            <li class="links_item no_extra"><a href="http://www.tencent.com/zh-cn/index.shtml" target="_blank">联系腾讯</a></li>
            <li class="links_item last_child"><a href="https://developers.weixin.qq.com/community/minihome/question/1366094922130079745" target="_blank">问题反馈</a></li>
        </ul>
    </div>
</div>
       
    </body>
    <script type="text/javascript">var MODULES = {'jweixin-1.2.1.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.2.1.src7b3046.js','.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/.js','wxlogin/index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxlogin/index7b3046.js','common/wx/Cgi.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/Cgi7b3046.js','common/wx/dialog.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/dialog7b3046.js','common/wx/Tips.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/Tips7b3046.js','common/wx/route.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/route7b3046.js','jweixin-1.6.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.6.0.src7b3046.js','regist/pwd.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/regist/pwd7b3046.js','common/qq/pwd.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/pwd7b3046.js','regist/regist2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/regist/regist27b3046.js','biz_web/utils/uploadOpen.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/utils/uploadOpen7b3046.js','common/wx/process.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/process7b3046.js','common/wx/dropdown.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/dropdown7b3046.js','common/wx/region.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/region7b3046.js','common/lib/jquery.validate.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/jquery.validate7b3046.js','common/wx/clientCode.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/clientCode7b3046.js','common/wx/overseasList.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/overseasList7b3046.js','common/wx/qrcheck.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/qrcheck7b3046.js','regist/regist.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/regist/regist7b3046.js','common/wx/verifycode.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/verifycode7b3046.js','common/lib/jquery.md5.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/jquery.md57b3046.js','common/wx/checkbox.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/checkbox7b3046.js','regist/reset.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/regist/reset7b3046.js','regist/forget.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/regist/forget7b3046.js','regist/upgrade.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/regist/upgrade7b3046.js','setting/verify.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/setting/verify7b3046.js','home/admin_popup.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/home/admin_popup7b3046.js','setting/pwd.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/setting/pwd7b3046.js','setting/openVerifyPop.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/setting/openVerifyPop7b3046.js','common/qq/mask.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/mask7b3046.js','setting/verify_new.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/setting/verify_new7b3046.js','common/wx/linktip.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/linktip7b3046.js','setting/dev.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/setting/dev7b3046.js','common/wx/popover.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/popover7b3046.js','common/wx/popup.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/popup7b3046.js','common/wx/qrcheck_weapp.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/qrcheck_weapp7b3046.js','jweixin-1.6.2.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.6.2.src7b3046.js','manage/appstore_tpl.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/appstore_tpl7b3046.js','manage/flowchart_tpl.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/flowchart_tpl7b3046.js','manage/appSecretDialog.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/appSecretDialog7b3046.js','common/qq/jquery.plugin/zclip.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/jquery.plugin/zclip7b3046.js','common/wx/Step.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/Step7b3046.js','tpl/home/admin_popup.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/home/admin_popup.html7b3046.js','manage/createStep1.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/createStep17b3046.js','biz_web/ui/checkbox.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/checkbox7b3046.js','manage/auth_scan_tpl.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/auth_scan_tpl7b3046.js','biz_web/ui/dropdown.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/dropdown7b3046.js','manage/list.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/list7b3046.js','common/lib/moment.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/moment7b3046.js','common/wx/pagebar.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/pagebar7b3046.js','common/wx/reportMMData.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/reportMMData7b3046.js','manage/app_bind_weapp.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/app_bind_weapp7b3046.js','tpl/manage/app_bind_weapp_jump.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/manage/app_bind_weapp_jump.html7b3046.js','tpl/manage/app_bind_weapp_subscribe.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/manage/app_bind_weapp_subscribe.html7b3046.js','tpl/manage/app_bind_weapp_subscribe_list.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/manage/app_bind_weapp_subscribe_list.html7b3046.js','tpl/manage/app_unbind_weapp.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/manage/app_unbind_weapp.html7b3046.js','manage/card_powered_apply.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/card_powered_apply7b3046.js','common/lib/json.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/json7b3046.js','manage/step2Submit.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/step2Submit7b3046.js','manage/plugin_detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/plugin_detail7b3046.js','common/wx/time.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/time7b3046.js','common/wx/tooltips.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/tooltips7b3046.js','manage/resetAppsecret.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/resetAppsecret7b3046.js','plugin/submit_pay.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/plugin/submit_pay7b3046.js','biz_web/lib/json.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/json7b3046.js','manage/card_business_detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/card_business_detail7b3046.js','manage/createWebStep2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/createWebStep27b3046.js','manage/apply_advanced.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/apply_advanced7b3046.js','widget/dropdown.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/dropdown7b3046.css','manage/modify.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/modify7b3046.js','manage/createMobileStep2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/createMobileStep27b3046.js','manage/detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/detail7b3046.js','manage/formatData.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/formatData7b3046.js','biz_common/moment.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/moment7b3046.js','manage/app_open_weapp.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/app_open_weapp7b3046.js','manage/create_card_business.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/create_card_business7b3046.js','manage/header.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/header7b3046.js','manage/createBizpluginStep3.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/createBizpluginStep37b3046.js','manage/create.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/create7b3046.js','manage/createBizpluginStep2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/createBizpluginStep27b3046.js','manage/wxOpenIndex.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/wxOpenIndex7b3046.js','manage/wxOpenDetail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/wxOpenDetail7b3046.js','manage/card_business_manage.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/card_business_manage7b3046.js','manage/plugin_modify.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/manage/plugin_modify7b3046.js','biz_common/utils/respTypes.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/respTypes7b3046.js','biz_common/utils/emoji_data.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/emoji_data7b3046.js','biz_common/utils/string/jsonDeepHtmldecode.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/string/jsonDeepHtmldecode7b3046.js','biz_common/utils/string/emoji.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/string/emoji7b3046.js','biz_common/utils/string/html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/string/html7b3046.js','biz_common/utils/huatuo.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/huatuo7b3046.js','biz_common/utils/format_ori_check_result.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/format_ori_check_result7b3046.js','biz_common/utils/cookie.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/cookie7b3046.js','biz_common/utils/asyncJs.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/asyncJs7b3046.js','biz_common/utils/norefererimg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/norefererimg7b3046.js','biz_common/utils/http.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/http7b3046.js','biz_common/utils/report.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/report7b3046.js','biz_common/utils/spin.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/spin7b3046.js','biz_common/utils/sha1.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/sha17b3046.js','biz_common/utils/url/parse.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/url/parse7b3046.js','biz_common/utils/wxgspeedsdk.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/wxgspeedsdk7b3046.js','biz_common/utils/monitor.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/monitor7b3046.js','biz_common/utils/load3rdimg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/load3rdimg7b3046.js','biz_common/utils/geolocation.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/geolocation7b3046.js','biz_common/utils/emoji_panel_data.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/emoji_panel_data7b3046.js','biz_common/utils/get_para_list.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/utils/get_para_list7b3046.js','biz_common/template-2.0.1-cmd.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/template-2.0.1-cmd7b3046.js','biz_common/ui/imgonepx.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/ui/imgonepx7b3046.js','biz_common/test/respTypesTest/index.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/test/respTypesTest/index.html7b3046.js','biz_common/aes.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/aes7b3046.js','biz_common/cookie.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/cookie7b3046.js','biz_common/jquery.validate.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/jquery.validate7b3046.js','biz_common/dom/offset.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/dom/offset7b3046.js','biz_common/dom/class.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/dom/class7b3046.js','biz_common/dom/attr.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/dom/attr7b3046.js','biz_common/dom/event.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/dom/event7b3046.js','biz_common/framework/localforage.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/framework/localforage7b3046.js','promise.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/promise.js','biz_common/framework/drivers/indexeddb.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/framework/drivers/indexeddb.js','biz_common/framework/drivers/localstorage.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/framework/drivers/localstorage.js','biz_common/framework/drivers/websql.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/framework/drivers/websql.js','biz_common/base64.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/base647b3046.js','biz_common/underscore.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/underscore7b3046.js','biz_common/log/jserr.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/log/jserr7b3046.js','biz_common/xss.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/xss7b3046.js','biz_common/jquery-1.9.1.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/jquery-1.9.17b3046.js','biz_common/jquery.ui/jquery.ui.draggable.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/jquery.ui/jquery.ui.draggable7b3046.js','biz_common/jquery.ui/jquery.ui.sortable.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/jquery.ui/jquery.ui.sortable7b3046.js','biz_common/jquery-2.1.4.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/jquery-2.1.47b3046.js','biz_common/tmpl.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/tmpl7b3046.js','biz_common/app_editor/filter/common/common_filter_base.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/filter/common/common_filter_base7b3046.js','biz_common/app_editor/filter/filterUtils.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/filter/filterUtils7b3046.js','biz_common/app_editor/filter/img/img_base_filter.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/filter/img/img_base_filter7b3046.js','biz_common/app_editor/filter/img/img_mobile_filter.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/filter/img/img_mobile_filter7b3046.js','biz_common/app_editor/articleUtils.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/articleUtils7b3046.js','biz_common/app_editor/article_data_key.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/article_data_key7b3046.js','app_editor/editor/utils.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/app_editor/editor/utils.js','biz_common/app_editor/clear_dom.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/app_editor/clear_dom7b3046.js','biz_common/virtual-template.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_common/virtual-template7b3046.js','jweixin-1.1.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.1.0.src7b3046.js','jweixin-1.0.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.0.0.src7b3046.js','wxverify/bindAccount.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/bindAccount7b3046.js','wxverify/wx2dcode.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/wx2dcode7b3046.js','wxverify/annual_warning.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/annual_warning7b3046.js','wxverify/bind_test_account.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/bind_test_account7b3046.js','wxverify/index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/index7b3046.js','wxverify/biz_detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/biz_detail7b3046.js','wxverify/invoice.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxverify/invoice7b3046.js','biz_web/utils/mplog.es.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/utils/mplog.es7b3046.js','biz_web/utils/upload.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/utils/upload7b3046.js','widget/upload.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/upload7b3046.css','biz_web/lib/webuploader.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader7b3046.js','tpl/uploader.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/uploader.html7b3046.js','biz_web/utils/Piper.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/utils/Piper7b3046.js','biz_web/utils/multiupload.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/utils/multiupload7b3046.js','common/wx/preview.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/preview.js','tpl/biz_web/ui/multiupload.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/biz_web/ui/multiupload.html7b3046.js','biz_web/widget/dropdown.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/biz_web/widget/dropdown7b3046.css','tpl/biz_web/ui/dropdown.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/biz_web/ui/dropdown.html7b3046.js','biz_web/ui/jquery.scrollbar.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/jquery.scrollbar7b3046.js','biz_web/widget/jquery.scrollbar.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/biz_web/widget/jquery.scrollbar7b3046.css','tpl/biz_web/ui/checkbox.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/biz_web/ui/checkbox.html7b3046.js','biz_web/ui/input/lentips.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/input/lentips7b3046.js','biz_web/ui/input/targetips.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/input/targetips7b3046.js','biz_web/ui/map.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/map7b3046.js','biz_web/ui/dateRange.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/ui/dateRange7b3046.js','tpl/biz_web/ui/dateRange.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/biz_web/ui/dateRange.html7b3046.js','biz_web/widget/date_range.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/biz_web/widget/date_range7b3046.css','tpl/biz_web/ui/timeRange.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/biz_web/ui/timeRange.html7b3046.js','biz_web/lib/store.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/store7b3046.js','biz_web/lib/webuploader/queue.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/queue7b3046.js','biz_web/lib/webuploader/base.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/base7b3046.js','biz_web/lib/webuploader/mediator.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/mediator7b3046.js','biz_web/lib/webuploader/file.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/file7b3046.js','biz_web/lib/webuploader/lib/image.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/lib/image7b3046.js','biz_web/lib/webuploader/runtime/client.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/client7b3046.js','biz_web/lib/webuploader/lib/blob.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/lib/blob7b3046.js','biz_web/lib/webuploader/lib/filepicker.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/lib/filepicker7b3046.js','biz_web/lib/webuploader/lib/file.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/lib/file7b3046.js','biz_web/lib/webuploader/lib/transport.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/lib/transport7b3046.js','biz_web/lib/webuploader/dollar-builtin.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/dollar-builtin7b3046.js','biz_web/lib/webuploader/uploader.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/uploader7b3046.js','biz_web/lib/webuploader/runtime/runtime.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/runtime7b3046.js','biz_web/lib/webuploader/runtime/compbase.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/compbase7b3046.js','biz_web/lib/webuploader/runtime/flash/runtime.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/flash/runtime7b3046.js','biz_web/lib/webuploader/runtime/flash/image.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/flash/image7b3046.js','biz_web/lib/webuploader/runtime/flash/filepicker.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/flash/filepicker7b3046.js','biz_web/lib/webuploader/runtime/flash/transport.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/flash/transport7b3046.js','biz_web/lib/webuploader/runtime/flash/blob.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/flash/blob7b3046.js','biz_web/lib/webuploader/runtime/html5/runtime.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/runtime7b3046.js','biz_web/lib/webuploader/runtime/html5/image.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/image7b3046.js','biz_web/lib/webuploader/runtime/html5/util.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/util7b3046.js','biz_web/lib/webuploader/runtime/html5/filepicker.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/filepicker7b3046.js','biz_web/lib/webuploader/runtime/html5/imagemeta.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/imagemeta7b3046.js','biz_web/lib/webuploader/runtime/html5/jpegencoder.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/jpegencoder7b3046.js','biz_web/lib/webuploader/runtime/html5/transport.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/transport7b3046.js','biz_web/lib/webuploader/runtime/html5/blob.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/blob7b3046.js','biz_web/lib/webuploader/runtime/html5/imagemeta/exif.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/runtime/html5/imagemeta/exif7b3046.js','biz_web/lib/webuploader/promise.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/promise7b3046.js','biz_web/lib/webuploader/dollar-third.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/dollar-third7b3046.js','biz_web/lib/webuploader/widgets/runtime.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/runtime7b3046.js','biz_web/lib/webuploader/widgets/widget.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/widget7b3046.js','biz_web/lib/webuploader/widgets/validator.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/validator7b3046.js','biz_web/lib/webuploader/widgets/upload.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/upload7b3046.js','biz_web/lib/webuploader/widgets/queue.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/queue7b3046.js','biz_web/lib/webuploader/widgets/image.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/image7b3046.js','biz_web/lib/webuploader/widgets/filepicker.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/webuploader/widgets/filepicker7b3046.js','biz_web/lib/highcharts.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/highcharts7b3046.js','biz_web/lib/audiojs.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/audiojs7b3046.js','biz_web/lib/uploadify.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/uploadify7b3046.js','biz_web/lib/swfobject.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/swfobject7b3046.js','biz_web/lib/soundmanager2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/soundmanager27b3046.js','biz_web/lib/video_v7.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/video_v77b3046.js','biz_web/lib/video.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/video7b3046.js','biz_web/lib/spin.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/spin7b3046.js','biz_web/lib/highcharts-v4.2.1.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/highcharts-v4.2.17b3046.js','biz_web/lib/highcharts-more-v4.2.4.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/highcharts-more-v4.2.47b3046.js','biz_web/lib/raphael-min.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/biz_web/lib/raphael-min7b3046.js','eve.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/eve.js','public/wxverify/nonprofitreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/nonprofitreg7b3046.js','public/wxverify/commonreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/commonreg7b3046.js','public/wxverify/supplement_verify_info.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/supplement_verify_info7b3046.js','common/wx/stopMultiRequest.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/stopMultiRequest7b3046.js','public/wxverify/mediaentreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/mediaentreg7b3046.js','public/wxverify/init.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/init7b3046.js','common/qq/queryString.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/queryString7b3046.js','public/wxverify/confirmName.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/confirmName7b3046.js','public/wxverify/step3.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/step37b3046.js','tpl/public/wxverify/step3.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/step3.html7b3046.js','tpl/public/wxverify/confirmname.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/confirmname.html7b3046.js','tpl/public/wxverify/commonreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/commonreg.html7b3046.js','public/wxverify/step4.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/step47b3046.js','tpl/public/wxverify/invoice_field.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/invoice_field.html7b3046.js','tpl/public/wxverify/step4.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/step4.html7b3046.js','public/wxverify/artistreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/artistreg7b3046.js','public/wxverify/civilianreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/civilianreg7b3046.js','public/wxverify/step1.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/step17b3046.js','tpl/public/wxverify/step1.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/step1.html7b3046.js','public/wxverify/shopreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/shopreg7b3046.js','public/wxverify/publicservice.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/publicservice7b3046.js','public/wxverify/step2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/step27b3046.js','public/wxverify/entreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/entreg7b3046.js','public/wxverify/govreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/govreg7b3046.js','public/wxverify/profitablereg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/profitablereg7b3046.js','public/wxverify/socialreg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/socialreg7b3046.js','public/wxverify/mediareg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/mediareg7b3046.js','tpl/public/wxverify/entreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/entreg.html7b3046.js','tpl/public/wxverify/mediaentreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/mediaentreg.html7b3046.js','tpl/public/wxverify/govreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/govreg.html7b3046.js','tpl/public/wxverify/nonprofitreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/nonprofitreg.html7b3046.js','tpl/public/wxverify/civilianreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/civilianreg.html7b3046.js','tpl/public/wxverify/profitablereg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/profitablereg.html7b3046.js','tpl/public/wxverify/shopreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/shopreg.html7b3046.js','tpl/public/wxverify/socialreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/socialreg.html7b3046.js','tpl/public/wxverify/mediareg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/mediareg.html7b3046.js','tpl/public/wxverify/artistreg.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/artistreg.html7b3046.js','tpl/public/wxverify/publicservice.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/publicservice.html7b3046.js','tpl/public/wxverify/step2.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/step2.html7b3046.js','public/wxverify/detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/detail7b3046.js','public/wxverify/invoice_edit.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/invoice_edit7b3046.js','tpl/public/wxverify/increment_tax_form.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/increment_tax_form.html7b3046.js','tpl/public/wxverify/invoice_edit.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/invoice_edit.html7b3046.js','public/wxverify/refill.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/refill7b3046.js','public/wxverify/Step.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/Step7b3046.js','public/wxverify/validateExtend.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/validateExtend7b3046.js','public/wxverify/step5.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/step57b3046.js','common/qq/prototype.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/prototype7b3046.js','widget/processor_bar.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/processor_bar7b3046.css','tpl/step.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/step.html7b3046.js','public/wxverify/index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/wxverify/index7b3046.js','tpl/public/wxverify/step5.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/step5.html7b3046.js','public/service/order_new.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/service/order_new7b3046.js','public/service/detail_new.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/service/detail_new7b3046.js','public/service/detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/service/detail7b3046.js','public/service/order.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/service/order7b3046.js','public/service/pay.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/public/service/pay7b3046.js','widget/popover.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/popover7b3046.css','common/qq/Class.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/Class7b3046.js','tpl/linktip.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/linktip.html7b3046.js','tpl/dropdown.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/dropdown.html7b3046.js','common/qq/hotkey.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/hotkey7b3046.js','widget/pagination.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/pagination7b3046.css','tpl/pagebar.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/pagebar.html7b3046.js','tpl/checkbox.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/checkbox.html7b3046.js','tpl/tooltips.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tooltips.html7b3046.js','common/wx/slider.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/slider7b3046.js','widget/qrcode_check.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/qrcode_check7b3046.css','tpl/qrcheck.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/qrcheck.html7b3046.js','widget/processor.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/processor7b3046.css','tpl/process.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/process.html7b3046.js','widget/qrcheck.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/qrcheck7b3046.css','tpl/qrcheck/qrcode.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/qrcheck/qrcode.html7b3046.js','tpl/qrcheck/popup.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/qrcheck/popup.html7b3046.js','common/wx/qrcheck_msg.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/qrcheck_msg7b3046.js','tpl/popup.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/popup.html7b3046.js','common/wx/qrcheck2.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/qrcheck27b3046.js','widget/verifycode.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/verifycode7b3046.css','tpl/verifycode.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/verifycode.html7b3046.js','common/wx/openLogin.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/openLogin7b3046.js','common/qq/jquery.plugin/Cookie.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/jquery.plugin/Cookie7b3046.js','tpl/popover.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/popover.html7b3046.js','common/wx/messenger.method.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/messenger.method7b3046.js','common/wx/messenger.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/messenger7b3046.js','common/lib/jquery.ui.draggable.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/jquery.ui.draggable7b3046.js','tpl/dialog.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/dialog.html7b3046.js','common/lib/MockJax.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/MockJax7b3046.js','common/lib/spin.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/spin7b3046.js','common/qq/jquery.plugin/serializeObject.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/jquery.plugin/serializeObject7b3046.js','common/qq/jquery.plugin/ZeroClipboard.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/jquery.plugin/ZeroClipboard7b3046.js','common/qq/events.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/qq/events7b3046.js','common/lib/uploadify.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/uploadify7b3046.js','common/lib/swfobject.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/swfobject7b3046.js','common/lib/jquery.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/jquery7b3046.js','common/lib/template.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/template7b3046.js','common/lib/datepicker.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib/datepicker7b3046.js','widget/datepicker.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/widget/datepicker7b3046.css','tpl/public/wxverify/common_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/common_preview.html7b3046.js','tpl/public/wxverify/shop_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/shop_preview.html7b3046.js','tpl/public/wxverify/mediaent_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/mediaent_preview.html7b3046.js','tpl/public/wxverify/profitable_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/profitable_preview.html7b3046.js','tpl/public/wxverify/nonprofit_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/nonprofit_preview.html7b3046.js','tpl/public/wxverify/civilian_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/civilian_preview.html7b3046.js','tpl/public/wxverify/artist_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/artist_preview.html7b3046.js','tpl/public/wxverify/social_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/social_preview.html7b3046.js','tpl/public/wxverify/gov_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/gov_preview.html7b3046.js','tpl/public/wxverify/ent_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/ent_preview.html7b3046.js','tpl/public/wxverify/media_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/media_preview.html7b3046.js','tpl/public/wxverify/publicservice_preview.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/public/wxverify/publicservice_preview.html7b3046.js','tpl/tort/step1.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/step1.html7b3046.js','tpl/tort/complaint_notice.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/complaint_notice.html7b3046.js','tpl/tort/appCard.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/appCard.html7b3046.js','tpl/tort/step4.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/step4.html7b3046.js','tpl/tort/appPopup.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/appPopup.html7b3046.js','tpl/tort/step2.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/step2.html7b3046.js','tpl/tort/step3.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/step3.html7b3046.js','tpl/tort/appeal_notice.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/appeal_notice.html7b3046.js','tpl/tort/view/contact_view_tpl.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/view/contact_view_tpl.html7b3046.js','tpl/tort/view/content_view_tpl.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/tort/view/content_view_tpl.html7b3046.js','tpl/nav.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/nav.html7b3046.js','tpl/cardticket/apply_logo.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/cardticket/apply_logo.html7b3046.js','tpl/cardticket/apply_card_deal.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/cardticket/apply_card_deal.html7b3046.js','tpl/news/home.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tpl/news/home.html7b3046.js','wxjump/index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/wxjump/index7b3046.js','statistics/analysis.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/statistics/analysis7b3046.js','jweixin-1.2.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.2.0.src7b3046.js','resource/resMenu.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/resource/resMenu7b3046.js','resource/resList.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/resource/resList7b3046.js','tort/appPopup.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/appPopup7b3046.js','tort/list.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/list7b3046.js','tort/Model.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/Model7b3046.js','tort/print.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/print7b3046.js','tort/process.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/process7b3046.js','tort/view/StepView.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/view/StepView7b3046.js','tort/view/OperView.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/view/OperView7b3046.js','tort/presenter/StepPresenter.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/presenter/StepPresenter7b3046.js','tort/presenter/OperPresenter.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/presenter/OperPresenter7b3046.js','tort/appeal_detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/appeal_detail7b3046.js','tort/view/step_3_view.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/view/step_3_view7b3046.js','tort/view/step_1_view.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/view/step_1_view7b3046.js','tort/view/step_2_view.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/view/step_2_view7b3046.js','tort/view/step_4_view.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/tort/view/step_4_view7b3046.js','jweixin-1.5.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.5.0.src7b3046.js','jweixin-1.6.1-beta.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.6.1-beta.src7b3046.js','jweixin-1.3.2.debug.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.3.2.debug.src7b3046.js','jweixin-1.6.1.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.6.1.src7b3046.js','home/appeal.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/home/appeal7b3046.js','home/notice.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/home/notice7b3046.js','home/index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/home/index7b3046.js','jweixin-1.3.1.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.3.1.src7b3046.js','web/modify.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/web/modify7b3046.js','web/detail.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/web/detail7b3046.js','web/create.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/web/create7b3046.js','jweixin-1.4.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.4.0.src7b3046.js','jweixin-1.3.0.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.3.0.src7b3046.js','cardticket/apply_card.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/cardticket/apply_card7b3046.js','cardticket/common_template_helper.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/cardticket/common_template_helper7b3046.js','cardticket/apply_logo.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/cardticket/apply_logo7b3046.js','cardticket/apply_jsapi.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/cardticket/apply_jsapi7b3046.js','page/cardticket/apply_widget_form.css': 'https://res.wx.qq.com/open/zh_CN/htmledition/res/css/page/cardticket/apply_widget_form7b3046.css','cardticket/common_validate.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/cardticket/common_validate7b3046.js','cardticket/apply_index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/cardticket/apply_index7b3046.js','news/list.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/news/list7b3046.js','news/protocol_plugin_account_tmpl.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/news/protocol_plugin_account_tmpl7b3046.js','news/protocol_developer_tmpl.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/news/protocol_developer_tmpl7b3046.js','news/news.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/news/news7b3046.js','payApply/baseInfo.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/payApply/baseInfo7b3046.js','payApply/businessMenu.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/payApply/businessMenu7b3046.js','payApply/fiance.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/payApply/fiance7b3046.js','payApply/businessInfo.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/payApply/businessInfo7b3046.js','payApply/index.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/payApply/index7b3046.js','jweixin-1.3.2.src.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/jweixin-1.3.2.src7b3046.js','plugin/tpl/submit_pay_list.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/plugin/tpl/submit_pay_list.html7b3046.js','plugin/tpl/submit_pay.html.js': 'https://res.wx.qq.com/open/zh_CN/htmledition/js/plugin/tpl/submit_pay.html7b3046.js'};</script>
    <script type="text/javascript">
    Report.point[21]=+new Date();
</script>
<script type="text/javascript" src="https://res.wx.qq.com/open/zh_CN/htmledition/js/sea7b3046.js"></script>
<script type="text/javascript" src="https://res.wx.qq.com/open/zh_CN/htmledition/js/common/lib7b3046.js"></script>
<script type="text/javascript" charset="utf-8">
    
    window.wx={
        T:function (str, data){
           return template.compile(str)(data);
        },
        url:function(url){
            if(url.indexOf("?")>-1){
                url+="&token=&lang="
            }else{
                url+="?token=&lang="
            }
            return url;  
        },
        data:{
            t:"",
            ticket:jQuery.cookie("ticket"),
            lang:''||getCookie('mm_lang')||"zh_CN",
            param:["&token=",'&lang='].join(""),
            user_name:jQuery.cookie("ticket_id_open"),
            nick_name:""
        },
        getUrl:function(name){
            var match=(window.location+"&").match(new RegExp("(?:\\?|\\&)"+name+"=(.*?)\\&"));
            if(match&&match[1]){
                return String(match[1]).html(true);
            }
        },
        fakeId:'', 
        fake_id: '',
        fake_id_open: '',
        token:"",
        path:{
            webuploader : "https://res.wx.qq.com/open/zh_CN/htmledition/res/swf/biz_web/webuploader7b3045.swf",
            zeroClipboard_new : "https://res.wx.qq.com/open/zh_CN/htmledition/res/swf/biz_web/ZeroClipboard_new7b3045.swf" 
        },
        wxverify : {
            annual_review : "",
            expired_time : ""
        },
        jslog : function(){}
    };


    
    seajs.use("common/wx/route");

    
    jQuery("#loginBar").on('click', '#loginBarBt', function(event) {
        var module=seajs.cache[seajs.resolve("common/wx/openLogin")];
        if(!module){
            seajs.use("common/wx/openLogin",function(m){
                m.main();
            });
        }else{
            module.exports.main();
        }
    });

    
    jQuery("#loginBar").on('click', '#loginBarRegisterBt', function(event) {
        jQuery.ajax({
            url : "https://open.weixin.qq.com/cgi-bin/logout",
            type: 'get',
            mask : true,
            success : function(json){
                var localHit = localStorage.getItem('localHit')
                if (localHit === '1') {
                    location.href = '/wxaopen/regist/index';
                } else {
                    location.href = '/cgi-bin/readtemplate?t=regist/regist_tmpl';
                }
            }
        });
    });

    $('#online_service').hide();
    
    const showOnlineService = Number(sessionStorage.getItem('showOnlineService'));
    if (showOnlineService) {
        if (showOnlineService === 1) {
            $('#online_service').show();
        } else {
            $('#online_service').hide();
        };
    } else {
        
        jQuery.ajax({
            url: "https://mp.weixin.qq.com/webpoc/cgi/chat/checkChatPermission?type=16&grayType=random",
            type: 'get',
            mask: true,
            success: function(json) {
                console.log('json', json);
                const showOnlineService = json.can ? 1 : 0;
                sessionStorage.setItem('showOnlineService', showOnlineService);
                if (showOnlineService === 1) {
                    $('#online_service').show();
                } else {
                    $('#online_service').hide();
                };
            },
        });
    };

    
    if (window.location.href.includes('cgi-bin/applist?t=manage/header')) {
        $('#online_service').hide();
    };

    $(".jsLangSelect[value='"+wx.data.lang+"']").parent().addClass('selected');
    jQuery(".jsLangSelect").click(function(event) {
        var lang=$(this).val();
        $(".jsLangLabel").removeClass('selected');
        $(this).parent(".jsLangLabel").addClass('selected');
        if(lang==wx.data.lang){
            return;
        }
        
        if(wx.data.t){
            jQuery.ajax({
                url: '/cgi-bin/modifyprofile?action=setlang',
                type: 'post',
                data: {
                    lang: lang,
                    token: wx.data.t
                },
            })
            .done(function() {
                location.reload();
            })
        
        }else{
            _cookie("mm_lang",lang);
            
            if(!new RegExp("mm_lang="+lang).test(document.cookie)){
                BJ_REPORT&&BJ_REPORT.monitor(118,147,document.cookie)
            }
            location.href=location.href.replace(/lang=[^\&]*/,"lang="+lang);
        }

    });

    function _cookie(key, value, days){
        days = days || 30;
        var exp  = new Date();

        exp.setTime(exp.getTime() + days*24*60*60*1000);

        document.cookie = key + "="+ escape(value) + ";path=/;expires=" + exp.toGMTString() ;
    }

    function getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length == 2) return parts.pop().split(';').shift();
        else return '';
    }

         jQuery("#biz_qrcode_a").hover(function(e){
        jQuery("#biz_qrcode_div").show();
    },function(e){
        jQuery("#biz_qrcode_div").hide();
    });

    
        
    window.nav={
        selected:function(id){
            jQuery(".jsNavItem[data-id='"+id+"']").addClass('selected').siblings().removeClass('selected');
        }
    };

    
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    };
    if(window.location.href.startsWith("http://open.weixin.qq.com")){
        window.location=window.location.href.replace("http","https");
    } ;
    Report.point[22]=+new Date();

    Report.init=function(flag1,flag2,flag3){
        this.url="http://isdspeed.qq.com/cgi-bin/r.cgi?"+Object.param({
            flag1:flag1,
            flag2:flag2,
            flag3:flag3
        });
        this.isReport=true;
    }

    
    try {
        _cookie('__CURRENT_TOKEN__', wx.token);
    } catch(err) {
        
    }
</script>
<script type="text/javascript" async src="https://res.wx.qq.com/open/zh_CN/htmledition/js/common/wx/http2_time7b3046.js"></script>

    
    <script type="text/javascript" charset="utf-8"> 
    !$(".selected").hasClass("jsNavItem")&&nav.selected("manage");
</script>
</html>

 
