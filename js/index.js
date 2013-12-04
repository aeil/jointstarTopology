$(function() {
	//declare
	var length = {
		slide: 221,
		slide_inner: 210,
		slide_height: 500,
//stage3
		//main: 1300,
//stage2
		//main: 900,
//stage1
		main: 750,
		main_height: 260,
        window_width: function(){
            return this.slide + this.main;
        },
//stage2
        //joint_height: 1250,
//stage2
        //joint_height: 900,
//stage1
        joint_height: 600,
	}
    var topologyStage = {
        stage3: {
                    width: 1300,
                    height: 1180
                },
        stage2: {
                    width: 900,
                    height:900 
                },
        stage1: {
                    width: 750,
                    height:600 
                },
        stage: [ 2, 10, 18 ],
        getStage: function(total){
            var curr_stage = 1;
            if(total < this.stage[1]){
                //stage1
            }
            else if(total >= this.stage[1] && total < this.stage[2]){
                //stage2
                curr_stage = 2;
            }
            else{ 
                curr_stage = 3;
            }
            return this['stage'+curr_stage]
        }
    }
	var path = {
		quality: "css/images/quality",
		vendor: "css/images/vendor",
		apps: "css/images/apps",
	}
	var resultsPerPage = 100;
	var refresh_rate = 500000;
	var intervalid = -1;
	var current_page = 0;
	var quality_img_name = ['gray','green','orange','red'];
	var vendor_img_name = ['android','mac','ubuntu','windows'];
        var cat_name = ['Instant messaging', 'P2P', 'File Transfer', 'Voice over IP', 'Database', 'Games'];
	var img_extension = '.png';
	var cache_data = {}, cache_userdetail = {};
    var current_tab = 0;
	//prototype
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
				return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
			});
		};
	}
	comDspMsg = function(args){
		console.log(arguments);
	}
	//end


	//multisel
	var ele_priority_qos_id = "priority_qos";
	$('#'+ele_priority_qos_id+' ').tableDnD({
		onDragStart: function(table, row){
			var selected = false;
			row = $(row);
			if(row.hasClass("alt")){
				selected = true;
			}
			$('#'+ele_priority_qos_id+'  tbody>tr').removeClass("alt");
			row.toggleClass("alt");
			if(selected){
				row.toggleClass("alt");
			}
		},
		onDrop: function(table, row) {
			comDspMsg("Result of $.tableDnD.serialise() is "+$.tableDnD.serialize());
			//comDspMsg("Result of $.tableDnD.serialise() is ");
			//$('#AjaxResult').load("server/ajaxTest.php?"+$.tableDnD.serialize());
		}
	});
	var set_cat = function(cat){
		var row = id = "";
		for(var i =0,j=cat.length;i<j;i++){
			id = cat[i];
			row = $('<tr></tr>').attr({ 'id': id, style:"cursor: move;" });//.appendTo('#'+ele_priority_qos_id+'  ');
			$('#'+ele_priority_qos_id).append(row);
			$('<td></td>').html(cat_name[id]).appendTo(row);
		}
		$('#'+ele_priority_qos_id).tableDnDUpdate();
	}

	$('#link-top').on('click', function(event) {
		comDspMsg("link-top click:", event.currentTarget.id);
		if($('#'+ele_priority_qos_id+' tbody>tr').hasClass("alt")){
			//only one
			var selected = $('#'+ele_priority_qos_id+'  tbody>tr').filter('.alt');
			if(selected.is(':first-child')){
				//if it's first/last, don't need to move
			}
			else{
					selected.clone(true).insertBefore(selected.prev());
					selected.remove();
			}
		}
	});

	$('#link-bottom').on('click', function(event) {
		comDspMsg("link-bottom click:", event.currentTarget.id);
		if($('#'+ele_priority_qos_id+' tbody>tr').hasClass("alt")){
			//only one
			var selected = $('#'+ele_priority_qos_id+'  tbody>tr').filter('.alt');
			if(selected.is(':last-child')){
				//if it's first/last, don't need to move
			}
			else{
				selected.clone(true).insertAfter(selected.next());
				selected.remove();
			}
		}
	});

	//checkbox
	$("input:radio[name='priority_qos_mode']").change(function(event){
		if(event.target.value == "0"){
			$("#"+ele_priority_qos_id).mask("Loading...");
		}
		else{
			$("#"+ele_priority_qos_id).unmask();
		}
	});


	//tab
	//$(".set-1").mtabs();

	$(".set-1").mtabs({
		onTabSelect: function(index) {
                         current_tab = index;
                         if(1 === index){
                             //comDspMsg("Selected tab is: " + index);
                             ////topology
                             //Joint.paper('topology', length.slide + length.main, length.joint_height);  
                             //drawTopology();
                             reflesh_topology();
                         }
                         else{
                             //destroy
                             $('#topology').empty();
                             reflesh();
                         }
		},
		onReady: function () {
			comDspMsg('Set 2 ready!');
		}
		//tab_text_el: ".heading, .head, header",
	});

	$('.set-1 .panel-1 .btn').on('click', function(event) {
		$('.set-1').mtabs('show', 2);

		event.preventDefault();
	});

	$('.set-1 .panel-1 .destroy').on('click', function(event) {
		$('.set-1').mtabs('destroy');

		event.preventDefault();
	});

	$('.set-1 .panel-1 .apply').on('click', function(event) {
		$('.set-1').mtabs();

		event.preventDefault();
	});

	$('.set-2 .panel-1 .btn').on('click', function(event) {
		$('.set-2').mtabs('show', 1);

		event.preventDefault();
	});

	//grid - user
	$(".user").flexigrid({
		url : 'example4.php?action=user',
		dataType : 'json',
		autoload: false,
		colModel : [ {
			display : 'Online User',
			name : 'user',
			width : length.slide_inner,
			sortable : true,
			align : 'center'
		}  ],
				singleSelect: true,
				onSuccess: function(self){
					comDspMsg(self, "user in");
					//console.table(self, "this");
				},
				preProcess: function(data){
					if (!data) {
						return false;
					}
					var div = '<div style="width:100%">';
					div     +='<div style="position:relative;float:left;"><image width="50px"src="'+path.vendor+'/{0}'+img_extension+'"/></div>';
					div     +='<div style="position:relative;word-wrap:break-word;overflow:hidden;text-align:left;">os_vendor: {1}<br/>host: {2}<br/>ip: {3}<br />mac: {4}<br />total app: {5}</div>';
					div     +='</div>';
                    var div_add = '<div style="width:100%"><div style="position:relative;float:left;"><image width="50px"src="'+path.vendor+'/{0}'+img_extension+'"/></div><div style="position:relative;word-wrap:break-word;overflow:hidden;text-align:left;">{1}</div>';

                    //for total
                    data.rows[0].cell.user = div_add.format("network", "All");
					for(var i=1, j = data.rows.length; i<j;i++){
						vendor = vendor_img_name[data.rows[i].cell.os_vendor_id];
						data.rows[i].cell.user = div.format(
							vendor, vendor,
							data.rows[i].cell.host,
							data.rows[i].cell.ipv4,
							data.rows[i].cell.mac,
							(get_apps_by_user(data.rows[i].cell.mac)).length
						) + data.rows[i].cell.employeeID;
					}
                    //data.rows[data.rows.length-1].cell.user = div_add.format("unknown", "other");
					return data;
				},
				sortname : "app_name",
				sortorder : "asc",
				useRp : false,
                idProperty: 'mac',
				width : length.slide,
				height : length.slide_height
			});
			$('.user').click(function(event){
				$('.trSelected', this).each( function(self, index){
					//var index = $(this).attr('id').substr(3);
					var index = $(this).attr('id');
					comDspMsg(
						self, index, event, 
						'  Id: '  + $(this).attr('id') +
						//'  rowId: '  + $(this).attr('id').substr(3) +
						'  name: '   + $('td[abbr="name"] >div', this).html() +
						'  sign: '   + $('td[abbr="sign"] >div', this).html() +
						'  status: ' + $('td[abbr="status"] >div', this).html() 
					);
					comDspMsg("onToggleCol: cid=", ",visible=", cache_data);
                    nonasyncget('example4.php?action=userdetail', function(data){
                        cache_userdetail = jQuery.extend(true, {}, data);
                    });
					toggleQos(typeof index != 'undefined'?
					index : undefined);
				});
			});

	$(".all_apps").flexigrid({
		url : 'example4.php?action=all_apps',
		dataType : 'json',
		autoload: false,
		colModel : [ {
			display : 'Application',
			name : 'app_name',
			width : 70,
			sortable : true,
			align : 'center'
		}, {
			display : 'Quality',
			name : 'quality',
			width : 50,
			sortable : true,
			align : 'center'
		}, {
			display : 'Host',
			name : 'host',
			width : 120,
			sortable : true,
			align : 'left'
		}, {
			display : 'Bandwidth',
			name : 'bandwidth',
			width : 370,
			sortable : true,
			align : 'left'
			} ],
			searchitems : [ {
				display : 'Application',
				name : 'employeeID'
			}, {
				display : 'Name',
				name : 'name',
				isdefault : true
				} ],
				singleSelect: true,
				preProcess: function(data){
					if (!data) {
						return false;
					}
					var quality = "<img src='" +
					path.quality +
					"/{0}"+img_extension+"'/>";
					var bandwidth = "<div style='height:100px;' id='{0}_{1}'></div>"

					comDspMsg("preProcess, ", data);
					for(var i=0, j = data.rows.length; i<j;i++){
						data.rows[i].cell['quality'] = quality.format(get_app_quality(data.rows[i].cell));
                        if(data.rows[i].cell['app_name'].indexOf("img") != -1){
                        }
                        else{
                            data.rows[i].cell['app_name'] += "<br /><img src='" +
                                path.apps + "/"+data.rows[i].cell['cat_id']+img_extension+"'/>";
                        }

						data.rows[i].cell['bandwidth'] = 
						bandwidth.format(
							data.rows[i].cell.mac.replace(/:/g, '_'),
							data.rows[i].cell.app_id
						);
					}
					/*
					*/
					return data;
				},
				sortname : "app_name",
				sortorder : "asc",
				usepager : true,
				useRp : true,
				rp : resultsPerPage,
				showTableToggleBtn : true,
				width : length.main,
				height : length.main_height/*,
				onChangePage: function(newp){
					//newp is current_page, pages is total 
					comDspMsg("all_apps: onChangePage, ", newp);
					var p = ($('.all_apps').flexGetOptions());

					if (!p.newp) {
						p.newp = 1;
					}
					if (p.page > p.pages) {
						p.page = p.pages;
					}
					

					$('.all_apps').flexOptions(p);
					$('.all_apps').flexAddData(filterApps(newp)); 
					//$('.all_apps').flexbuildpager();
					comDspMsg($('.all_apps').flexGetOptions());
				},
				onSuccess: function(self, p){
					//newp is current_page, pages is total 
					comDspMsg("all_apps: onSuccess, self", self, ", params: ", p);
				}
				*/
			});

	//set interval
	var reflesh = function(){
        switch(current_tab){
            case 0:
                reflesh_qos();
                break;
            case 1:
                reflesh_topology();
                break;
            default:
        }
//        //get all app
//        //cache_data = jQuery.extend(true, {}, nonasyncget('example4.php'));
//        nonasyncget('example4.php', function(data){
//            cache_data = jQuery.extend(true, {}, data);
//        });
//        if(typeof $('.trSelected').attr('id') != 'undefined'){
//            //singleUser
//            comDspMsg("$('.trSelected').attr('id') != 'undefined'");
//            nonasyncget('example4.php?action=userdetail', function(data){
//                cache_userdetail = jQuery.extend(true, {}, data);
//            });
//        }
//        else{
//            $('.all_apps').flexAddData(cache_data);
//        }
//        //if selected, keep status 
//        //maybe slow!!!
//        var element = "", user_id=-1;
//        $('.trSelected').each( function(index, ele){
//            element = ele;
//        });
//        user_id = $(element).children().text();
//        user_id = $(element).children().text().substr(user_id.indexOf('mac: ')+5, 17);
//        $('.user').flexAddData(get_distinct_users(cache_data));
//        $('.user tr').each(function(index, ele){
//            var id = $(ele).children().text();
//            id = $(ele).children().text().substr(id.indexOf('mac: ')+5, 17);
//            if(id === user_id){
//                $(ele).addClass('trSelected');
//            }
//        });
//        /*
//		$.ajax({
//			type: 'get',
//			url: 'example4.php',
//			dataType: 'json',
//			async:   false,
//			success: function (data) {
//				$('.user').flexAddData(get_distinct_users(data));
//                cache_data = jQuery.extend(true, {}, data);
//				//$('.all_apps').flexAddData(filterApps());
//				$('.all_apps').flexAddData(cache_data);
//				comDspMsg('cache_data: ', cache_data.rows[0].cell.employeeID, cache_data);
//			},
//			error: function (XMLHttpRequest, textStatus, errorThrown) {
//				try {
//					if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
//				} catch (e) {}
//			}
//		});
//        */
//
//        /*
//        //get userdetail
//        $.ajax({
//            type: 'GET',
//            url: 'example4.php?action=userdetail',
//            async:   false,
//            success: function (data) {
//				cache_userdetail = jQuery.extend(true, {}, data);
//                comDspMsg("in get_user detail, cache_userdetail=", cache_userdetail);
//            },
//            error: function (XMLHttpRequest, textStatus, errorThrown) {
//                       try {
//                           if (p.onError) {
//                               p.onError(XMLHttpRequest, textStatus, errorThrown);
//                           }
//                       } 
//                       catch (e) {
//                       }
//                   }
//        });
//        */

	}
    var reflesh_topology = function(){
        nonasyncget('example4.php?action=userdetail', function(data){
            cache_userdetail = jQuery.extend(true, {}, data);
        });

        $('#topology').empty();
        var stage = topologyStage.getStage(cache_userdetail.rows.length);
        comDspMsg("topologyStage: ", stage);
        Joint.paper('topology', length.slide + stage.width, stage.height);  
        //Joint.paper('topology', length.slide + length.main, length.joint_height);  
        drawTopology(length.slide + stage.width, stage.height);
    }
    var reflesh_qos = function(){
        //get all app
        //cache_data = jQuery.extend(true, {}, nonasyncget('example4.php'));
        nonasyncget('example4.php', function(data){
            cache_data = jQuery.extend(true, {}, data);
        });
        nonasyncget('example4.php?action=userdetail', function(data){
            cache_userdetail = jQuery.extend(true, {}, data);
        });
        //add all network
        cache_userdetail.total +=1;
        cache_userdetail.rows.unshift({
            cell:{
                     mac: 0
                 },
            mac: 0
        });
        //unknown people
        //cache_userdetail.rows.push({
        //    cell:{
        //             mac: -1
        //         },
        //    mac: -1
        //});


        if(typeof $('.trSelected').attr('id') != 'undefined'){
            //singleUser
            //comDspMsg("$('.trSelected').attr('id') != 'undefined'");
            //nonasyncget('example4.php?action=userdetail', function(data){
            //    cache_userdetail = jQuery.extend(true, {}, data);
            //});
        }
        else{
            $('.all_apps').flexAddData(cache_data);
        }
        //if selected, keep status, but not include all
        //maybe slow!!!
        var element = "", user_id=-1;
        $('.trSelected[id]').each( function(index, ele){
            //element = ele;
            //replace may broken if id is undefined
            user_id = $(ele).attr('id').replace(/_/g, ':');
        });
        //user_id = $(element).children().text();
        //user_id = $(element).children().text().substr(user_id.indexOf('mac: ')+5, 17);
        //$('.user').flexAddData(get_distinct_users(cache_data));
        $('.user').flexAddData(cache_userdetail);
        $('.user tr[id]').each(function(index, ele){
            //var id = $(ele).children().text();
            //id = $(ele).children().text().substr(id.indexOf('mac: ')+5, 17);
            if($(ele).attr('id').replace(/_/g, ':') === user_id){
                $(ele).addClass('trSelected');
                toggleQos(user_id);
            }
        });
    }
	//end

	var get_user = function(user_id){
		var user = [];
		if(typeof user_id != 'undefined'){
			comDspMsg(cache_data.total, cache_data);
			for(var i=0,j=cache_data.total;i<j;i++){
				if(cache_data.rows[i].cell.mac === user_id){
					user.push(cache_data.rows[i].cell);
				}
			}
			comDspMsg('get_user: user_id=', user_id, " data= ", user); 
			return user;
		}
	}

	var get_distinct_users = function(data){
		var users = [], index = [];
		if(typeof data != 'undefined'){
			for(var i=0,j=data.total;i<j;i++){
				if(index.indexOf(data.rows[i].cell.mac) < 0){
					users.push(data.rows[i]);
					index.push(data.rows[i].cell.mac);
				}
				else{
				}
			}
			comDspMsg('get_distinct_users: data=', data, " users= ", users); 
			return {
				page: data.page,
				rows: users,
				total:users.length
			};
		}
	}

	var get_cat = function(){
		var data = [], index = [];
		for(var i=0,j=cache_data.total;i<j;i++){
			if(index.indexOf(cache_data.rows[i].cell.cat_id) < 0){
				index.push(cache_data.rows[i].cell.cat_id);
			}
			else{
			}
		}
		
		comDspMsg('get_cat: ', 'index = ', index);
		return index;
	}
	var get_app_quality = function(record){
		//only download
		var link_type = 'down';
		var color = 0;

		if(undefined == record[link_type + '_rate']){
			return quality_img_name[color];
		}

		if(record[link_type + '_rate'] > record[link_type+'_cfg_rate'] * 1.25 )
		{
			//red
			color = 3;
		}
		else{
			//orange
			if( record[link_type + '_rate'] > record[link_type+'_cfg_rate'] * 0.75 ){
				color = 2;
			}
			else{
				color = 1;
			}
		}
		return quality_img_name[color];
	}
	var get_apps_by_user = function(user_id){
		var data = [], index = [];
		if(typeof data != 'undefined'){
			for(var i=0,j=cache_data.total;i<j;i++){
				if(cache_data.rows[i].cell.mac === user_id){
					data.push(cache_data.rows[i].cell);
				}
				else{
				}
			}
		}
		
		comDspMsg('get_apps_by_user: ', 'data = ', data);
		return data;
	}
	var filterApps = function(newp, target){
		var filterData = [], newp, pages, rp;

		target = target || '.all_apps';
		params = $(target).flexGetOptions();
		newp   = newp || 1;
		/*
		if(typeof params.newp == 'undefined'){
			//first initial
			newp = parseInt(params.page, 10);
		}
		else{
			newp = parseInt(params.newp, 10);
		}
		*/
		console.log(newp, "newp", params.newp);
		pages= parseInt(params.pages,10);
		rp   = parseInt(params.rp,   10);

		for(var i=(newp-1)*rp,j=Math.min(newp*rp-1, cache_data.total);i<j;i++){
			console.log(i, j);
			filterData.push(cache_data.rows[
			i]);
		}
		comDspMsg("filterApps:", params, cache_data, filterData);

		return ({
			page: cache_data.page,
			rows: filterData,
			total:cache_data.total
		});
	}
	var toggleSingle = function(user_id){
		var data = [];
		if(typeof user_id != 'undefined'){
			for(var i=0,j=cache_data.total;i<j;i++){
				if(cache_data.rows[i].cell.mac === user_id){
					data.push(cache_data.rows[i]);
				}
			}
			comDspMsg('toggleSingle : user_id=', user_id, " data= ", data); 
			return ({
				page: cache_data.page,
				rows: data,
				total:cache_data.total
			});
		}
	}
	var toggleQos = function(user_id){
        var ele_user_detail = $('#user_detail'),
            ele_piechart = $('#piechart'),
            ele_priority = $('#priority');

		//search user by index
		if(typeof user_id != 'undefined'){
			//singleUser
			var data = {}, user_detail = {};
			//for(var i=0,j=cache_data.total;i<j;i++){
			//	if(cache_data.rows[i].id == user_index){
			//		user_id = cache_data.rows[i].cell.mac;
			//		break;
			//	}
			//}
			//var columns = columns || ['host', 'os_name', 'uptime', 'ipv4', 'weight', 'upload', 'device_profile', 'device_priority', 'schedule', 'download', 'mac'];
			//comDspMsg(cache_data.rows[i].id, user_index);
            
            user_id = user_id.replace(/_/g, ':');
			data = toggleSingle(user_id);
			$('.all_apps').flexAddData(data);
            for(var i=0,j=cache_userdetail.rows.length;i<j;i++){
                if(cache_userdetail.rows[i].cell.mac == user_id){
                    data = cache_userdetail.rows[i].cell;
                    break;
                }
            }
			$('#uptime').val(set_timeToGmt(data.uptime));
			$('#weight').val(data.weight);
			$('#upload').val(get_unit(data.upload));
			$('#deviceprofile').val(data.deviceprofile);
			$('#schedule').val(data.schedule);
			$('#download').val(get_unit(data.download));
			$('#devicepriority').val(data.devicepriority);

            ele_user_detail.show();
            ele_piechart.hide();
            ele_priority.hide();
		}
		else{
			//total User
			$('.all_apps').flexAddData(cache_data);
            comDspMsg("ele_piechart=", ele_piechart);
            ele_piechart.show();
            ele_priority.show();
            ele_user_detail.hide();
		}
        //ele_piechart.toggle();
        //ele_priority.toggle();
        //ele_user_detail.toggle();
	}
    var get_unit = function( unit ){
        //1, 10^3, 10^6, 10^9
        var size = ['bytes', 'Kbytes', 'MB', 'GB'];
        var length = size.length;
        if( unit < 0 ){
        }
        else{
            for( var i=length; i > 0; i-- ){
                var quotient = unit / Math.pow(10, 3*(i-1));
                if( quotient >= 1 ){
                    return quotient.toFixed(2) + ' ' + size[i-1];
                }
            }
        }
        return 0 + ' ' + size[0];
    }
    var drawTopology = function(topologyWidth, topologyHeight){
        var mydia = Joint.dia.mydia = {};
        var tspan_width = 160, tspan_height = 80;
        var org = Joint.dia.org;
        var divition = 5;
        var filter = [-1];
        var div     =path.vendor+'/{0}'+img_extension;
        var vendor = -1;

        //root in center
        var rec  = cache_data.rows[0].cell;
        //left bottom [x,y] position
        var chartXY = $('#topology').position();
        //console.log( chartXY ,length.window_width()/2);// - chartXY[0] ,chartXY[1] - length.slide_height + tspan_height);
        //var os_image = os_name_icon_mapping[rec.get('os_name').toString().toLowerCase()];
        var avatar_alert = 5;//rec.get('device_priority') || 5;
        //var dotLeft = length.window_width()/2 - chartXY.left,
        //    dotTop = chartXY.top + length.joint_height/2 - tspan_height - 50;
        var dotLeft = topologyWidth/2 - chartXY.left,
            dotTop = chartXY.top + topologyHeight/2 - tspan_height - 50;
            //dotTop = 0 + tspan_height * 2;
        var Member = {
            rect: { 
                      //x: chartXY[0] + tspan_width ,
                      x: dotLeft,
                      //y: chartXY.top - length.slide_height + tspan_height,
                      //y: chartXY.top + length.slide_height/2, 
                      y: dotTop,
                      width: tspan_width - 106, 
                      height: tspan_height - 25 
                  },
                    shadow: false,
                    labelOffsetY: 8,
                    padding: 3,
            //position: "home network",
            attrs: {
                stroke: 'gray' 
            },
            _opt:{
                     draggable:false 
                 }
        };
        Member['avatar'] =  div.format("network");
            //if( showImg ){
            //    Member['avatar'] =  'images/platform/icon/';//+os_image+img_extension
            //}
        var root = org.Member.create(Member);


        var radius = 200;
        var avd = 360/cache_userdetail.rows.length;
        var ahd = avd*Math.PI/180;
        var xy = {};
        for (var j = 0, l = cache_userdetail.rows.length; j < l; j++){
            rec = cache_userdetail.rows[j].cell;
            var uid = rec.mac;
            //if( -1 == filter.indexOf(uid)){
            {
                filter.push( uid);
                //os_image = os_name_icon_mapping[rec.get('os_name').toString().toLowerCase()];
                var x =  y =0,unit_x = length.window_width() / divition,
                    unit_y= length.slide_height/ divition;

                //divition*divition space
                //sqrt for not show inner
                //x1=Math.cos(Math.PI/180*30)*n1;   
                //y1=Math.sin(Math.PI/180*30)*n1;  
                var sqrt = Math.floor( Math.sqrt(divition));
                var tmp_index = j;
                if( j + sqrt < Math.pow(divition,2 )){
                    if( j > divition && j < divition *2)
                    {
                        j += sqrt;
                    }
                    else if( j >= divition *2 ){
                        j += sqrt * 2;
                    }
                    var quotient = Math.floor (j / divition),
                        remainder = j % divition;
                    x = unit_x * remainder;
                    y = unit_y * quotient;
                }
                //comDspMsg(x, y, j, unit_x, unit_y, tmp_index);
                j = tmp_index;
                avatar_alert = 1;//rec.get('device_priority') || 1;
                vendor = vendor_img_name[rec.os_vendor_id];
                xy = jQuery.extend(true, {}, getposition(j,
                            cache_userdetail.rows.length,
                            dotLeft-tspan_width/2, dotTop-tspan_height/2,
                            tspan_width, tspan_height));
                Member = {
                    rect: { 
                              x: xy.x,
                              y: xy.y, 
                              //x: x,
                              //y: y, 
                              //x: Math.sin((ahd*j))*radius+length.window_width()/2 - chartXY.left,
                              //y: Math.cos((ahd*j))*radius+tspan_height * 2,
                              width: tspan_width, 
                              height: tspan_height 
                          },
                    platform: "Uptime: "    + set_timeToGmt(rec.uptime),
                    name: "platform: "      + vendor,
                    position: "host: "      + rec.ipv4,
                    ti:"upload: "           + get_unit(rec.uptime),
                    download:"download: "   + get_unit(rec.download),
                    //ti:"Traffic Indicator: ",// + index + "|x=" + x+"|y="+y,
                    //avatar_alert: 'images/toolbar/alert'+avatar_alert+img_extension,
                    //{x:-28+a+this.attrs.x,y:-5
                    //avatar_alert_width: avatar_alert,
                    labelOffsetY: 8,
                    shadow: false,
                    padding: 3,
                    attrs: {
                        fill: '#ededed', 
                        stroke: 'gray' ,
                    },
                    _opt:{
                             draggable: false
                         }
                };
                //only image size
                //{x:d,y:f,width:48,height:48
                Member['avatar'] =  div.format(vendor);
                    //if( showImg ){
                    //    Member['avatar'] = 'images/platform/icon/'+os_image+img_extension;
                    //}
                var bart = org.Member.create(Member);
                root.joint(bart, org.arrow);
            }
        }
        /*
        */
    }
    var set_timeToGmt = function(unix_timestamp){
        unix_timestamp = parseInt( unix_timestamp, 10 );
        var hours = Math.floor(unix_timestamp / (60 * 60));
        var divisor_for_minutes = unix_timestamp % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        return hours + 'h:' + minutes + 'm:' + seconds + 's';
    }
    var nonasyncget = function(url, initial){
        $.ajax({
            type: 'get',
        url: url,
        dataType: 'json',
        async:   false,
        success: function (data) {
            initial(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
                   try {
                       if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
                   } catch (e) {}
               }
        });
    }
    var getPhase = function(degree){
        degree = degree % 360;
        var phase = 0;
            if(degree >= 270 && degree < 360){
                phase = 3;
            }
            else if(degree >= 0 && degree < 90){
                phase = 4;
            }
            else if(degree >= 90 && degree < 180){
                phase = 1;
            }
            else if(degree >= 180 && degree < 270){
                phase = 2;
            }
            return phase;
    }
    var getposition = function(index, total, dotLeft, dotTop, tspan_width, tspan_height){
        //like H electric model
        //initial start at 0(sin(0)), 1(cos(0)) when 
        //stage0: 2
        //stage1: 8
        //stage2: 8
        //stage3: 18
        var radius = radius || 150;
        var avd = 360/cache_userdetail.rows.length;
        var ahd = avd*Math.PI/180;
        var x = -1,
            y = -1;
        var stage1, stage2, stage3;
        var degree = 0;
        //var x = Math.sin((ahd*index))*radius+dotLeft,
        //    y = Math.cos((ahd*index))*radius+dotTop;
        if(total < 3){
            avd = 360/total;
            ahd = avd*Math.PI/180;
            degree = ahd*index;
            x = Math.sin(degree)*radius+dotLeft;
            y = Math.cos(degree)*radius+dotTop + (degree > Math.PI/2 ? 0: tspan_height/2);
        }
        else if(total >= 3 && total < 11){
            //joint_height: 600,
            stage1 = 2;
            if(index < stage1){
                avd = 360/stage1;
                radius = 68;
            }
            else{
                avd = 360/(total-stage1);
                radius = 213;
            }
            ahd = avd*Math.PI/180;
            degree = ahd*(index);
            x = Math.sin(degree)*radius+dotLeft;
            y = Math.cos(degree)*radius+dotTop //+ tspan_height/3;
            phase = getPhase(avd*index);
            //x = Math.sin(degree)*radius+dotLeft +(avd*(index-stage1) >= 0 && avd*(index-stage1) < 90? tspan_width/2 : 0);
            switch(phase){
                case 4:
                    y = Math.cos(degree)*radius+dotTop + tspan_height/2;
                    x = Math.sin(degree)*radius+dotLeft + tspan_width/1.5;
                    break;
                case 3:
                    y = Math.cos(degree)*radius+dotTop + tspan_height/2;
                    break;
                case 1:
                    x = Math.sin(degree)*radius+dotLeft + tspan_width/2;
                    break;
            }
            //if(3 == phase || 4 == phase)
            //{
            //    y = Math.cos(degree)*radius+dotTop + tspan_height/2;
            //}
            //else if(1 == phase){
            //    x = Math.sin(degree)*radius+dotLeft + tspan_width/2;
            //}
            //y = Math.cos((ahd*index))*radius+dotTop;
            //y = Math.cos(degree)*radius+dotTop + (index %2 == 1? 0: tspan_height/2);
            //y = Math.cos(degree)*radius+dotTop + (degree > Math.PI/2 ? 0: tspan_height/2);
            //y = Math.cos(degree)*radius+dotTop + (degree > Math.PI/2 ? -1: 1)*(tspan_height/2);
            comDspMsg("calculate:", index, "drgree=", avd*index, "degree_phase=", getPhase(avd*index));
        }
        else if(total >= 11 && total < 19){
            stage1 = 2;
            stage2 = 10
            //if(index < stage1){
            //    avd = 360/stage1;
            //    radius = 90;
            //}
            //else if(index >= stage1 && index < stage2){
            //    avd = 360/(total-stage1);
            //    radius = 217;
            //}
            //else{ 
            //    avd = 360/(total-stage2);
            //    radius = 260;
            //}
            //ahd = avd*Math.PI/180;
            //x = Math.sin((ahd*index))*radius+dotLeft;
            //y = Math.cos((ahd*index))*radius+dotTop;
            if(index < stage1){
                avd = 360/stage1;
                radius = 68;
            }
            else if(index >= stage1 && index < stage2){
                if(total - stage2 >= 0){
                    avd = 360/(stage2 - stage1);
                }
                else{
                    avd = 360/(total-stage1);
                }
                radius = 213;
            }
            else{ 
                avd = 360/(total-stage2);
                radius = 355;
            }
            ahd = avd*Math.PI/180;
            radian = ahd*(index);
            if(radius == 355){
                radian += .3;
            }
            x = Math.sin(radian)*radius+dotLeft;
            y = Math.cos(radian)*radius+dotTop //+ tspan_height/3;
            phase = getPhase(avd*index);
            degree= avd*index;
            //x = Math.sin(radian)*radius+dotLeft +(avd*(index-stage1) >= 0 && avd*(index-stage1) < 90? tspan_width/2 : 0);
            switch(phase){
                case 4:
                    y = Math.cos(radian)*radius+dotTop + tspan_height/2;
                    x = Math.sin(radian)*radius+dotLeft + tspan_width/2;
                    break;
                case 3:
                    y = Math.cos(radian)*radius+dotTop + tspan_height/2;
                    break;
                case 1:
                    x = Math.sin(radian)*radius+dotLeft + tspan_width/2;
                    break;
            }
            var insqueer = 45;
            if(degree > 90-insqueer && degree <90+insqueer){
                x -=tspan_width/2;
            }
            else if(degree > 270-insqueer && degree <270+insqueer){
                x +=tspan_width/2;
            }
            comDspMsg("calculate:", index, "drgree=", avd*index, "radian_phase=", getPhase(avd*index));
        }
        else {
            stage1 = 2;
            stage2 = 10;
            stage3 = 18;
            
            if(index < stage1){
                avd = 360/stage1;
                radius = 68;
            }
            else if(index >= stage1 && index < stage2){
                if(total - stage2 >= 0){
                    avd = 360/(stage2 - stage1);
                }
                else{
                    avd = 360/(total-stage1);
                }
                radius = 213;
            }
            else if(index >= stage2 && index < stage3){
                if(total - stage3 >= 0){
                    avd = 360/(stage3 - stage2);
                }
                else{
                    avd = 360/(total-stage3);
                }
                radius = 355;
            }
            else{ 
                avd = 360/(total-stage3);
                radius = 500;
            }
            ahd = avd*Math.PI/180;
            radian = ahd*(index);
            if(radius == 355){
                radian += .3;
            }
            else if(radius == 500){
                radian += .39;
            }
            x = Math.sin(radian)*radius+dotLeft;
            y = Math.cos(radian)*radius+dotTop //+ tspan_height/3;
            phase = getPhase(avd*index);
            degree= avd*index;
            //x = Math.sin(radian)*radius+dotLeft +(avd*(index-stage1) >= 0 && avd*(index-stage1) < 90? tspan_width/2 : 0);
            switch(phase){
                case 4:
                    y = Math.cos(radian)*radius+dotTop + tspan_height/2;
                    x = Math.sin(radian)*radius+dotLeft + tspan_width/2;
                    break;
                case 3:
                    y = Math.cos(radian)*radius+dotTop + tspan_height/2;
                    break;
                case 1:
                    x = Math.sin(radian)*radius+dotLeft + tspan_width/2;
                    break;
            }
            var insqueer = 45, insqueer_half=45/2;
            if(degree > 90-insqueer && degree <90+insqueer){
                x -=tspan_width/2;
            }
            else if(degree > 270-insqueer && degree <270+insqueer){
                x +=tspan_width/2;
            }

            if(degree > 360-insqueer_half && degree <0+insqueer_half){
                y -=tspan_height/2;
            }
            else if(degree > 180-insqueer_half && degree <180+insqueer_half){
                y +=tspan_height/4;
            }
            comDspMsg("calculate: at stage3=", total, index, "drgree=", avd*index, "radian_phase=", getPhase(avd*index));
        }
        return ({
            x: x,
               y: y
        });
    }


	//initial
    //nonasyncget('example4.php?action=userdetail', function(data){
    //    cache_userdetail = jQuery.extend(true, {}, data);
    //});
	reflesh();
    get_user("00:16:b2:dc:30:f0");
	get_cat();

	set_cat(get_cat());
	intervalid = setInterval( reflesh, refresh_rate );
});
