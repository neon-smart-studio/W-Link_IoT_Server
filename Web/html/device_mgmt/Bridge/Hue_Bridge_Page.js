$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

var link_button_auth_timer = null;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Bridge'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Hue Bridge":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Hue Bridge Link Successfully":
                                    if(link_button_auth_timer!=null)
                                    {
                                        Print_Hue_Bridge_Link_Successfully_Page();
                                        clearInterval(link_button_auth_timer);
                                        link_button_auth_timer = null;
                                    }
                                    break;
                                case "Report Hue Bridge Synchronize Lights Successfully":
                                    var index = Find_Device_Index_By_ID(in_json.device_ID);
                                    var display_area_id_str = "hue_bridge_"+index+"_sync_lights_status_display_area";
                                    var exit_btn_id_str = "hue_bridge_"+index+"_sync_lights_modal_exit_btn";
                                    Display_Hue_Bridge_Synchronize_Done_Page(display_area_id_str, exit_btn_id_str, true);
                                    break;
                                case "Report Hue Bridge Synchronize Lights Failed":
                                    var index = Find_Device_Index_By_ID(in_json.device_ID);
                                    var display_area_id_str = "hue_bridge_"+index+"_sync_lights_status_display_area";
                                    var exit_btn_id_str = "hue_bridge_"+index+"_sync_lights_modal_exit_btn";
                                    Display_Hue_Bridge_Synchronize_Done_Page(display_area_id_str, exit_btn_id_str, false);
                                    break;
                                case "Report Hue Bridge Synchronize Groups Successfully":
                                    var index = Find_Device_Index_By_ID(in_json.device_ID);
                                    var display_area_id_str = "hue_bridge_"+index+"_sync_groups_status_display_area";
                                    var exit_btn_id_str = "hue_bridge_"+index+"_sync_groups_modal_exit_btn";
                                    Display_Hue_Bridge_Synchronize_Done_Page(display_area_id_str, exit_btn_id_str, true);
                                    break;
                                case "Report Hue Bridge Synchronize Groups Failed":
                                    var index = Find_Device_Index_By_ID(in_json.device_ID);
                                    var display_area_id_str = "hue_bridge_"+index+"_sync_groups_status_display_area";
                                    var exit_btn_id_str = "hue_bridge_"+index+"_sync_groups_modal_exit_btn";
                                    Display_Hue_Bridge_Synchronize_Done_Page(display_area_id_str, exit_btn_id_str, false);
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
    return "Hue 橋接器";
}

function Print_Discovered_Hue_Bridge_List(hue_bridge_list)
{
    var show_hue_bridge_list = [];
    show_hue_bridge_list.push("<div data-role=\"panel\" style=\"min-height: 120px;\">");
    if(hue_bridge_list.num_of_hue_bridge>0)
    {
        show_hue_bridge_list.push("<div class=\"grid\">");
        for (var i = 0; i < hue_bridge_list.num_of_hue_bridge; i++) {
            var hue_bridge_info = hue_bridge_list.discovered_hue_bridge_list[i].config;
            show_hue_bridge_list.push("<div class=\"row\">");
            show_hue_bridge_list.push("<div data-role=\"hint\" class=\"tile bg-mauve fg-white\" style=\"width:410px;height: 110px;margin-left: 7.5px;margin-bottom: 7.5px;\" \
                                        data-hint-position=\"top\" data-hint-text=\""+hue_bridge_info.name+"\">");
            show_hue_bridge_list.push("<h3 class=\"fg-white\" style=\"margin-left: 10px;margin-top: 10px;margin-bottom: 5px;\">"+hue_bridge_info.name+"("+hue_bridge_info.modelid+")</h3>");
            show_hue_bridge_list.push("<button data-role=\"hint\" data-hint-text=\"連線\" id=\"\" \
                                        class=\"button success square large fg-white\" style=\"float:right;margin-top: 7.5px;margin-right: 5px;\" \
                                        onclick=\"onClick_Connect_To_Hue_Bridge_Btn('"+hue_bridge_info.ipaddress+"');\">");
            show_hue_bridge_list.push("<span class=\"mif-link\"></span>");
            show_hue_bridge_list.push("</button>");
            show_hue_bridge_list.push("</div>");
            show_hue_bridge_list.push("</div>");
        }
        show_hue_bridge_list.push("</div>");
    }
    else{
        show_hue_bridge_list.push("<h2 class=\"fg-red\" style=\"margin-left: 10px;\">沒有找到任何Hue橋接器 :(</h2>");
    }
    show_hue_bridge_list.push("</div>");

    $('#new_hue_bridge_display_area').html('');
    $('#new_hue_bridge_display_area').html(show_hue_bridge_list.join(''));
}

function Print_Link_Hue_Bridge_Page()
{
    var show_link_hue_bridge_status = [];

    show_link_hue_bridge_status.push("<div class=\"grid\">");
    show_link_hue_bridge_status.push("<div class=\"row\">");
    show_link_hue_bridge_status.push("<div class=\"cell-4 offset-4\">");
    show_link_hue_bridge_status.push("<div class=\"img-container\">");
    show_link_hue_bridge_status.push("<img src=\"/images/hue_bridge_push_link_button.png\">");
    show_link_hue_bridge_status.push("<div class=\"image-overlay op-dark\">");
    show_link_hue_bridge_status.push("<div class=\"h4\">按下按鈕進行認證!</div>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("<div class=\"cell-4\"/>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("<div class=\"row\" style=\"margin-top: 10px;\">");
    show_link_hue_bridge_status.push("<div data-role=\"progress\" data-type=\"load\" id=\"hue_bridge_link_button_remain_time\" \
                                    data-value=\"100\" data-small=\"true\"></div>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("</div>");
    
    $('#new_hue_bridge_display_area').html('');
    $('#new_hue_bridge_display_area').html(show_link_hue_bridge_status.join(''));

    var link_button_auth_sec_cnt = 20;
    if(link_button_auth_timer==null)
    {
        link_button_auth_timer = setInterval(() => {
            link_button_auth_sec_cnt--;
            if(link_button_auth_sec_cnt<=0)
            {
                clearInterval(link_button_auth_timer);
                link_button_auth_timer = null;
            
                setTimeout(() => {
                    Metro.dialog.close('#add_hue_bridge_modal');
                    $('#new_hue_bridge_display_area').html('');
                }, 500);
            }
            $("#hue_bridge_link_button_remain_time").attr('data-value', link_button_auth_sec_cnt*5);
        }, 1000);
    }
}

function Print_Hue_Bridge_Link_Successfully_Page()
{
    var show_link_hue_bridge_status = [];

    show_link_hue_bridge_status.push("<div class=\"grid\">");
    show_link_hue_bridge_status.push("<div class=\"row\">");
    show_link_hue_bridge_status.push("<div class=\"cell-6 offset-3\" style=\"text-align: center;\">");
    show_link_hue_bridge_status.push("<span class=\"fg-green mif-checkmark mif-5x\"></span>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("<div class=\"cell-3\"/>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("<div class=\"row\">");
    show_link_hue_bridge_status.push("<div class=\"cell-6 offset-3\" style=\"text-align: center;\">");
    show_link_hue_bridge_status.push("<h2 class=\"fg-green\" style=\"margin-top:0px;\">認證成功</h2>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("<div class=\"cell-3\"/>");
    show_link_hue_bridge_status.push("</div>");
    show_link_hue_bridge_status.push("</div>");

    $('#new_hue_bridge_display_area').html('');
    $('#new_hue_bridge_display_area').html(show_link_hue_bridge_status.join(''));

    Device_MGMT_Update_Device_List();
}

function onClick_Connect_To_Hue_Bridge_Btn(ip_address)
{
    Link_To_Hue_Bridge(ip_address);

    Print_Link_Hue_Bridge_Page();
}

function onClick_Add_Hue_Bridge_Btn()
{
    Metro.dialog.open('#add_hue_bridge_modal');

    Discover_Nearby_Hue_Bridge(function(rsp_json){
        Print_Discovered_Hue_Bridge_List(rsp_json);
    });
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{
    var print_toolbar = [];
    
    print_toolbar.push("<button data-role=\"hint\" data-hint-text=\"新增Hue橋接器\" id=\"\"\
                                class=\"button square large outline fg-mauve bd-mauve\"\
                                onclick=\"onClick_Add_Hue_Bridge_Btn();\">");
    print_toolbar.push("<span class=\"mif-plus\"></span>");
    print_toolbar.push("</button>");
    print_toolbar.push("<div class=\"dialog\" data-role=\"dialog\" id=\"add_hue_bridge_modal\">");
    print_toolbar.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">新增Hue橋接器</h2></div>");
    print_toolbar.push("<div class=\"dialog-content\">");
    print_toolbar.push("<div id=\"new_hue_bridge_display_area\"/>");
    print_toolbar.push("</div>");
    print_toolbar.push("<div class=\"dialog-actions text-right\">");
    print_toolbar.push("<button class=\"button alert js-dialog-close\" onclick=\"$('#new_hue_bridge_display_area').html('')\">離開</button>");
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

    show_device_op_settings.push("<div data-role=\"tile\" data-size=\"medium\" class=\"bg-orange fg-white\" onclick=\"onClick_Sync_Hue_Bridge_Lights_Tile('"+index+"')\">");
    show_device_op_settings.push("<span class=\"mif-lamp mif-4x icon\"></span>");
    show_device_op_settings.push("<span class=\"branding-bar\">同步燈光裝置</span>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div data-role=\"tile\" data-size=\"medium\" class=\"bg-red fg-white\" onclick=\"onClick_Sync_Hue_Bridge_Groups_Tile('"+index+"')\">");
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

    show_device_op_settings.push("<div class=\"dialog\" data-role=\"dialog\" id=\"hue_bridge_"+index+"_sync_lights_modal\">");
    show_device_op_settings.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">同步燈光裝置</h2></div>");
    show_device_op_settings.push("<div class=\"dialog-content\">");
    show_device_op_settings.push("<div id=\"hue_bridge_"+index+"_sync_lights_status_display_area\"/>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("<div class=\"dialog-actions text-right\">");
    show_device_op_settings.push("<button class=\"button alert js-dialog-close\" id=\"hue_bridge_"+index+"_sync_lights_modal_exit_btn\">離開</button>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("</div>");

    show_device_op_settings.push("<div class=\"dialog\" data-role=\"dialog\" id=\"hue_bridge_"+index+"_sync_groups_modal\">");
    show_device_op_settings.push("<div class=\"dialog-title\"><h2 class=\"fg-mauve\">同步群組設定</h2></div>");
    show_device_op_settings.push("<div class=\"dialog-content\">");
    show_device_op_settings.push("<div id=\"hue_bridge_"+index+"_sync_groups_status_display_area\"/>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("<div class=\"dialog-actions text-right\">");
    show_device_op_settings.push("<button class=\"button alert js-dialog-close\" id=\"hue_bridge_"+index+"_sync_groups_modal_exit_btn\">離開</button>");
    show_device_op_settings.push("</div>");
    show_device_op_settings.push("</div>");

    $('#'+print_info_dst_id).html('');
    $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

    update_online_status_cb(true);
}

function onClick_Sync_Hue_Bridge_Lights_Tile(index_str)
{
    $('#hue_bridge_'+index_str+'_sync_lights_modal_exit_btn').addClass('disabled');

    Metro.dialog.open('#hue_bridge_'+index_str+'_sync_lights_modal');

    Hue_Bridge_Synchronize_All_Light_Info(Get_Device_ID_By_Index(Number(index_str)));

    $('#hue_bridge_'+index_str+'_sync_lights_status_display_area').html('');
    $('#hue_bridge_'+index_str+'_sync_lights_status_display_area').html('<div data-role="progress" data-type="line"></div>');
}

function onClick_Sync_Hue_Bridge_Groups_Tile(index_str)
{
    $('#hue_bridge_'+index_str+'_sync_groups_modal_exit_btn').addClass('disabled');

    Metro.dialog.open('#hue_bridge_'+index_str+'_sync_groups_modal');

    Hue_Bridge_Synchronize_All_Group_Info(Get_Device_ID_By_Index(Number(index_str)));

    $('#hue_bridge_'+index_str+'_sync_groups_status_display_area').html('');
    $('#hue_bridge_'+index_str+'_sync_groups_status_display_area').html('<div data-role="progress" data-type="line"></div>');
}

function Display_Hue_Bridge_Synchronize_Done_Page(disolay_area_id, exit_btn_id, success)
{
    var show_sync_hue_bridge_status = [];

    show_sync_hue_bridge_status.push("<div class=\"grid\">");
    show_sync_hue_bridge_status.push("<div class=\"row\">");
    show_sync_hue_bridge_status.push("<div class=\"cell-6 offset-3\" style=\"text-align: center;\">");
    if(success)
    {
        show_sync_hue_bridge_status.push("<span class=\"fg-green mif-checkmark mif-5x\"></span>");
    }
    else{
        show_sync_hue_bridge_status.push("<span class=\"fg-red mif-cross mif-5x\"></span>");
    }
    show_sync_hue_bridge_status.push("</div>");
    show_sync_hue_bridge_status.push("<div class=\"cell-3\"/>");
    show_sync_hue_bridge_status.push("</div>");
    show_sync_hue_bridge_status.push("<div class=\"row\">");
    show_sync_hue_bridge_status.push("<div class=\"cell-6 offset-3\" style=\"text-align: center;\">");
    if(success)
    {
        show_sync_hue_bridge_status.push("<h2 class=\"fg-green\" style=\"margin-top:0px;\">同步成功</h2>");
    }
    else{
        show_sync_hue_bridge_status.push("<h2 class=\"fg-red\" style=\"margin-top:0px;\">同步錯誤</h2>");
    }
    show_sync_hue_bridge_status.push("</div>");
    show_sync_hue_bridge_status.push("<div class=\"cell-3\"/>");
    show_sync_hue_bridge_status.push("</div>");
    show_sync_hue_bridge_status.push("</div>");

    $('#'+disolay_area_id).html('');
    $('#'+disolay_area_id).html(show_sync_hue_bridge_status.join(''));
    
    $('#'+exit_btn_id).removeClass('disabled');
}
