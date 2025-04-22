$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

var link_button_auth_timer = null;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Integrate'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "LIFX":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report LIFX Link Successfully":
                                    if(link_button_auth_timer!=null)
                                    {
                                        Print_LIFX_Link_Successfully_Page();
                                        clearInterval(link_button_auth_timer);
                                        link_button_auth_timer = null;
                                    }
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
    return "LIFX 智慧燈";
}

function Print_Discovered_LIFX_List(lifx_list)
{
    var show_lifx_list = [];
    show_lifx_list.push("<div data-role=\"panel\" style=\"min-height: 120px; max-height: 400px; overflow-y: auto;\">");
    if(lifx_list.num_of_lifx>0)
    {
        show_lifx_list.push("<div class=\"grid\">");
        for (var i = 0; i < lifx_list.num_of_lifx; i++) {
            var lifx_info = lifx_list.discovered_lifx_list[i];
            show_lifx_list.push("<div class=\"row\">");
            show_lifx_list.push("<div data-role=\"hint\" class=\"tile bg-mauve fg-white\" style=\"width:410px;height: 135px;margin-left: 7.5px;margin-bottom: 7.5px;\" \
                                        data-hint-position=\"top\" data-hint-text=\""+lifx_info.name+"\">");
            show_lifx_list.push("<h3 class=\"fg-white\" style=\"margin-left: 10px;margin-top: 10px;margin-bottom: 5px;\">"+lifx_info.name+"("+lifx_info.productName+")</h3>");
            show_lifx_list.push("<button data-role=\"hint\" data-hint-text=\"連線\" id=\"\" \
                                        class=\"button success square large fg-white\" style=\"float:right;margin-top: 7.5px;margin-right: 5px;\" \
                                        onclick=\"onClick_Connect_To_LIFX_Btn('"+lifx_info.ip+"', '"+lifx_info.mac+"');\">");
            show_lifx_list.push("<span class=\"mif-link\"></span>");
            show_lifx_list.push("</button>");
            show_lifx_list.push("</div>");
            show_lifx_list.push("</div>");
        }
        show_lifx_list.push("</div>");
    }
    else{
        show_lifx_list.push("<h2 class=\"fg-red\" style=\"margin-left: 10px;\">沒有找到任何LIFX燈泡 :(</h2>");
    }
    show_lifx_list.push("</div>");

    $('#new_lifx_display_area').html('');
    $('#new_lifx_display_area').html(show_lifx_list.join(''));
}

function onClick_Connect_To_LIFX_Btn(ip_address, mac_address)
{
    Link_To_LIFX(ip_address, mac_address);

    Device_MGMT_Update_Device_List();
}

function onClick_Add_LIFX_Btn()
{
    Metro.dialog.open('#add_lifx_modal');

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
    $('#new_lifx_display_area').html('');
    $('#new_lifx_display_area').html(show_scan_progress.join(''));

    Discover_Nearby_LIFX(function(rsp_json){
        Print_Discovered_LIFX_List(rsp_json);
    });
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{
    var print_toolbar = [];
    
    print_toolbar.push("<button data-role=\"hint\" data-hint-text=\"新增LIFX燈泡\" id=\"\"\
                                class=\"button square large outline fg-mauve bd-mauve\"\
                                onclick=\"onClick_Add_LIFX_Btn();\">");
    print_toolbar.push("<span class=\"mif-plus\"></span>");
    print_toolbar.push("</button>");
    print_toolbar.push("<div class=\"dialog\" data-role=\"dialog\" id=\"add_lifx_modal\">");
    print_toolbar.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">新增LIFX燈泡</h2></div>");
    print_toolbar.push("<div class=\"dialog-content\">");
    print_toolbar.push("<div id=\"new_lifx_display_area\"/>");
    print_toolbar.push("</div>");
    print_toolbar.push("<div class=\"dialog-actions text-right\">");
    print_toolbar.push("<button class=\"button alert js-dialog-close\" onclick=\"$('#new_lifx_display_area').html('')\">離開</button>");
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
    var show_device_op_settings = [];

    show_device_op_settings.push("<div class=\"row\">");
    show_device_op_settings.push("<h2 class=\"fg-mauve\">操作:</h2>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div class=\"row\">");
    show_device_op_settings.push("<div class=\"cell-11\">");
    show_device_op_settings.push("<div class=\"tiles-grid\">");

    show_device_op_settings.push("<div data-role=\"tile\" data-size=\"medium\" class=\"bg-orange fg-white\" onclick=\"onClick_Sync_LIFX_Lights_Tile('"+index+"')\">");
    show_device_op_settings.push("<span class=\"mif-lamp mif-4x icon\"></span>");
    show_device_op_settings.push("<span class=\"branding-bar\">同步燈光裝置</span>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div data-role=\"tile\" data-size=\"medium\" class=\"bg-red fg-white\" onclick=\"onClick_Sync_LIFX_Groups_Tile('"+index+"')\">");
    show_device_op_settings.push("<span class=\"mif-dialpad mif-4x icon\"></span>");
    show_device_op_settings.push("<span class=\"branding-bar\">同步群組設定</span>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div data-role=\"tile\" data-size=\"medium\" class=\"bg-green fg-white\">");
    show_device_op_settings.push("<span class=\"mif-cogs mif-4x icon\"></span>");
    show_device_op_settings.push("<span class=\"branding-bar\">同步全部設定</span>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("</div>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("<div class=\"cell-1\"></div>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div class=\"dialog\" data-role=\"dialog\" id=\"lifx_"+index+"_sync_lights_modal\">");
    show_device_op_settings.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">同步燈光裝置</h2></div>");
    show_device_op_settings.push("<div class=\"dialog-content\">");
    show_device_op_settings.push("<div id=\"lifx_"+index+"_sync_lights_status_display_area\"/>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("<div class=\"dialog-actions text-right\">");
    show_device_op_settings.push("<button class=\"button alert js-dialog-close\" id=\"lifx_"+index+"_sync_lights_modal_exit_btn\">離開</button>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div class=\"dialog\" data-role=\"dialog\" id=\"lifx_"+index+"_sync_groups_modal\">");
    show_device_op_settings.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">同步群組設定</h2></div>");
    show_device_op_settings.push("<div class=\"dialog-content\">");
    show_device_op_settings.push("<div id=\"lifx_"+index+"_sync_groups_status_display_area\"/>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("<div class=\"dialog-actions text-right\">");
    show_device_op_settings.push("<button class=\"button alert js-dialog-close\" id=\"lifx_"+index+"_sync_groups_modal_exit_btn\">離開</button>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("</div>");

    $('#'+print_info_dst_id).html('');
    $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

    update_online_status_cb(true);
}

function onClick_Sync_LIFX_Lights_Tile(index_str)
{
    $('#lifx_'+index_str+'_sync_lights_modal_exit_btn').addClass('disabled');

    Metro.dialog.open('#lifx_'+index_str+'_sync_lights_modal');

    LIFX_Synchronize_All_Light_Info(Get_Device_ID_By_Index(Number(index_str)));

    $('#lifx_'+index_str+'_sync_lights_status_display_area').html('');
    $('#lifx_'+index_str+'_sync_lights_status_display_area').html('<div data-role="progress" data-type="line"></div>');
}

function onClick_Sync_LIFX_Groups_Tile(index_str)
{
    $('#lifx_'+index_str+'_sync_groups_modal_exit_btn').addClass('disabled');

    Metro.dialog.open('#lifx_'+index_str+'_sync_groups_modal');

    LIFX_Synchronize_All_Group_Info(Get_Device_ID_By_Index(Number(index_str)));

    $('#lifx_'+index_str+'_sync_groups_status_display_area').html('');
    $('#lifx_'+index_str+'_sync_groups_status_display_area').html('<div data-role="progress" data-type="line"></div>');
}
