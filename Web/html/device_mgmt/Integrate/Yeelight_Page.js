$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Integrate'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Yeelight":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Yeelight Link Successfully":
                                    Print_Yeelight_Link_Successfully_Page();
                                    break;
                            }
                        }
                        break;
                }
            }
        }
    }
}

function Handle_Device_WebSocket_GET_Message(in_json)
{
    return null;
}

function Get_Device_Type_Chinese_Name(index)
{
    return "Yeelight 智慧燈";
}

function Print_Discovered_Yeelight_List(yeelight_list)
{
    var show_yeelight_list = [];
    show_yeelight_list.push("<div data-role=\"panel\" style=\"min-height: 120px; max-height: 400px; overflow-y: auto;\">");
    if(yeelight_list.num_of_yeelight>0)
    {
        show_yeelight_list.push("<div class=\"grid\">");
        for (var i = 0; i < yeelight_list.num_of_yeelight; i++) {
            var yeelight_info = yeelight_list.discovered_yeelight_list[i];
            show_yeelight_list.push("<div class=\"row\">");
            show_yeelight_list.push("<div data-role=\"hint\" class=\"tile bg-mauve fg-white\" style=\"width:410px;height: 135px;margin-left: 7.5px;margin-bottom: 7.5px;\" \
                                        data-hint-position=\"top\" data-hint-text=\""+yeelight_info.name+"\">");
            show_yeelight_list.push("<h3 class=\"fg-white\" style=\"margin-left: 10px;margin-top: 10px;margin-bottom: 5px;\">"+yeelight_info.name+"("+yeelight_info.ip+")</h3>");
            show_yeelight_list.push("<button data-role=\"hint\" data-hint-text=\"連線\" id=\"\" \
                                        class=\"button success square large fg-white\" style=\"position:absolute; bottom:5px; right:5px;\" \
                                        onclick=\"onClick_Connect_To_Yeelight_Btn('"+yeelight_info.ip+"');\">");
            show_yeelight_list.push("<span class=\"mif-link\"></span>");
            show_yeelight_list.push("</button>");
            show_yeelight_list.push("</div>");
            show_yeelight_list.push("</div>");
        }
        show_yeelight_list.push("</div>");
    }
    else{
        show_yeelight_list.push("<h2 class=\"fg-red\" style=\"margin-left: 10px;\">沒有找到任何Yeelight燈泡 :(</h2>");
    }
    show_yeelight_list.push("</div>");

    $('#new_yeelight_display_area').html('');
    $('#new_yeelight_display_area').html(show_yeelight_list.join(''));
}

function Print_Yeelight_Link_Successfully_Page()
{
    var show_link_yeelight_status = [];

    show_link_yeelight_status.push("<div class=\"grid\">");
    show_link_yeelight_status.push("<div class=\"row\">");
    show_link_yeelight_status.push("<div class=\"cell-6 offset-3\" style=\"text-align: center;\">");
    show_link_yeelight_status.push("<span class=\"fg-green mif-checkmark mif-5x\"></span>");
    show_link_yeelight_status.push("</div>");
    show_link_yeelight_status.push("<div class=\"cell-3\"/>");
    show_link_yeelight_status.push("</div>");
    show_link_yeelight_status.push("<div class=\"row\">");
    show_link_yeelight_status.push("<div class=\"cell-6 offset-3\" style=\"text-align: center;\">");
    show_link_yeelight_status.push("<h2 class=\"fg-green\" style=\"margin-top:0px;\">連接成功</h2>");
    show_link_yeelight_status.push("</div>");
    show_link_yeelight_status.push("<div class=\"cell-3\"/>");
    show_link_yeelight_status.push("</div>");
    show_link_yeelight_status.push("</div>");

    $('#new_yeelight_display_area').html('');
    $('#new_yeelight_display_area').html(show_link_yeelight_status.join(''));

    Update_Device_List();
}

function onClick_Connect_To_Yeelight_Btn(ip_address)
{
    Link_To_Yeelight(ip_address);
}

function onClick_Add_Yeelight_Btn()
{
    Metro.dialog.open('#add_yeelight_modal');

    var show_scan_progress = [];
    show_scan_progress.push("<h3 class=\"fg-orange\">搜尋中，這可能會需要一些時間!</h3><br><br>");
    show_scan_progress.push("<div class=\"progress-ring\" style=\"position: relative;margin: 0 auto\">");
    show_scan_progress.push("<div class=\"outer\"><div class=\"inner bg-orange\"></div></div>");
    show_scan_progress.push("<div class=\"outer ball1\"><div class=\"inner bg-orange\"></div></div>");
    show_scan_progress.push("<div class=\"outer ball2\"><div class=\"inner bg-orange\"></div></div>");
    show_scan_progress.push("<div class=\"outer ball3\"><div class=\"inner bg-orange\"></div></div>");
    show_scan_progress.push("<div class=\"outer ball4\"><div class=\"inner bg-orange\"></div></div>");
    show_scan_progress.push("<div class=\"outer ball5\"><div class=\"inner bg-orange\"></div></div>");
    show_scan_progress.push("</div>");
    $('#new_yeelight_display_area').html('');
    $('#new_yeelight_display_area').html(show_scan_progress.join(''));

    Discover_Nearby_Yeelight(function(rsp_json){
        Print_Discovered_Yeelight_List(rsp_json);
    });
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{
    var print_toolbar = [];
    
    print_toolbar.push("<button data-role=\"hint\" data-hint-text=\"新增Yeelight燈泡\" id=\"\"\
                                class=\"button square large outline fg-mauve bd-mauve\"\
                                onclick=\"onClick_Add_Yeelight_Btn();\">");
    print_toolbar.push("<span class=\"mif-plus\"></span>");
    print_toolbar.push("</button>");
    print_toolbar.push("<div class=\"dialog\" data-role=\"dialog\" id=\"add_yeelight_modal\">");
    print_toolbar.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">新增Yeelight燈泡</h2></div>");
    print_toolbar.push("<div class=\"dialog-content\">");
    print_toolbar.push("<div id=\"new_yeelight_display_area\"/>");
    print_toolbar.push("</div>");
    print_toolbar.push("<div class=\"dialog-actions text-right\">");
    print_toolbar.push("<button class=\"button alert js-dialog-close\" onclick=\"$('#new_yeelight_display_area').html('')\">離開</button>");
    print_toolbar.push("</div>");
    print_toolbar.push("</div>");
    
    $('#'+print_info_dst_id).html('');
    $('#'+print_info_dst_id).html(print_toolbar.join(''));
    
    $('#'+print_info_dst_id).css('margin-left', '10px');
    $('#'+print_info_dst_id).css('margin-bottom', '10px');
}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{
    $('#'+print_info_dst_id).css('margin-left', '0px');
    $('#'+print_info_dst_id).css('margin-bottom', '0px');
}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
}