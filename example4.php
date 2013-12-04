<?php

    session_start();

    $page = isset($_POST['page']) ? $_POST['page'] : 1;
    $rp = isset($_POST['rp']) ? $_POST['rp'] : 10;
    $sortname = isset($_POST['sortname']) ? $_POST['sortname'] : 'name';
    $sortorder = isset($_POST['sortorder']) ? $_POST['sortorder'] : 'desc';
    $query = isset($_POST['query']) ? $_POST['query'] : false;
    $qtype = isset($_POST['qtype']) ? $_POST['qtype'] : false;


    if(isset($_GET['Add'])){ // this is for adding records

        $rows = $_SESSION['Example4'];
        $rows[$_GET['EmpID']] = 
        array(
            'name'=>$_GET['Name']
            , 'favorite_color'=>$_GET['FavoriteColor']
            , 'favorite_pet'=>$_GET['FavoritePet']
            , 'primary_language'=>$_GET['PrimaryLanguage']
        );
        $_SESSION['Example4'] = $rows;

    }
    elseif(isset($_GET['Edit'])){ // this is for Editing records
        $rows = $_SESSION['Example4'];
        
        unset($rows[trim($_GET['OrgEmpID'])]);  // just delete the original entry and add.
        
        $rows[$_GET['EmpID']] = 
        array(
            'name'=>$_GET['Name']
            , 'favorite_color'=>$_GET['FavoriteColor']
            , 'favorite_pet'=>$_GET['FavoritePet']
            , 'primary_language'=>$_GET['PrimaryLanguage']
        );
        $_SESSION['Example4'] = $rows;
    }
    elseif(isset($_GET['Delete'])){ // this is for removing records
        $rows = $_SESSION['Example4'];
        unset($rows[trim($_GET['Delete'])]);  // to remove the \n
        $_SESSION['Example4'] = $rows;
    }
    else{

        if(isset($_SESSION['Example4'])){ // get session if there is one
            $rows = $_SESSION['Example4'];
        }
        else{ // create session with some data if there isn't
            $rows[1] = array('name'=>'Tony',   'favorite_color'=>'green',  'favorite_pet'=>'hamster',   'primary_language'=>'english');
            $rows[2] = array('name'=>'Mary',   'favorite_color'=>'red',    'favorite_pet'=>'groundhog', 'primary_language'=>'spanish');
            $rows[3] = array('name'=>'Seth',   'favorite_color'=>'silver', 'favorite_pet'=>'snake',     'primary_language'=>'french');
            $rows[4] = array('name'=>'Sandra', 'favorite_color'=>'blue',   'favorite_pet'=>'cat',       'primary_language'=>'mandarin');
            $_SESSION['Example4'] = $rows;
        }

	header('Access-Control-Allow-Origin: *');
        header("Content-type: application/json");
        $jsonData = array('page'=>$page,'total'=>0,'rows'=>array());
	/*
	 *
	 * add simple test data
	 */
	$app_cat = array(array('1','Instant messaging'), array('2','P2P'), array('3','File Transfer'), array('4','Voice over IP'), array('5','Database'), array('6','Games'), array('7','Network Management'), array('8','Remote Access Terminals'), array('9','Bypass Proxies and Tunnels'), array('10','Stock Market'), array('11','Web / Web 2.0'), array('12','Security Update'), array('13','Web IM'), array('14','Mail and Collaboration'), array('15','Business'), array('16','Streaming Media'), array('17','Private Protocol'), array('18','Network Protocols'), array('19','Mobile'), array('20','Social Network'), array('21','Instant messaging'), array('22','Instant messaging'), array('23','Instant messaging'), array('24','Instant messaging'), array('25','Instant messaging'));
    shuffle($app_cat);

	$host_name = array('Sophia','Emma','Isabella','Olivia','Ava','Emily','Abigail','Mia','Madison','Elizabeth','Chloe','Ella','Avery','Addison','Aubrey','Lily','Natalie','Sofia','Charlotte','Zoey');

	$app_name = array('Instant messaging' ,'MSN' ,'Yahoo Messenger' ,'ICQ/AIM/iIM' ,'QQ/TM' ,'IRC' ,'Yoics' ,'Rediff BOL' ,'Google Talk' ,'Gadu-Gadu' ,'POPO' ,'Tlen' ,'Wlt' ,'RenRen' ,'IPMSG' ,'Mail.ru IM' ,'Kubao' ,'Lava-Lava' ,'PaltalkScene' ,'UcTalk' ,'WinpopupX' ,'ISPQ' ,'ChatON(M)' ,'Caihong' ,'IMVU' ,'Instan-t' ,'PiIM' ,'Xfire' ,'WhatsApp(M)' ,'Userplane' ,'Camfrog' ,'Message Send Protocol' ,'Fetion' ,'Heyyo' ,'Alicall' ,'Qeshow' ,'MissLee' ,'Jctrans' ,'BaiduHi' ,'TELTEL' ,'9158' ,'Kltx' ,'IM+(M)' ,'Imi' ,'Netcall' ,'ECP' ,'Etnano' ,'Dii' ,'Weibo IM' ,'Trillian' ,'HipChat' ,'IntraMessenger' ,'BitWise' ,'Barablu' ,'Whoshere(M)' ,'LiiHo(M)' ,'Appme(M)' ,'Verychat(M)' ,'Voxer(M)' ,'TextMe(M)' ,'Bump(M)' ,'CoolMessenger' ,'NateOn' ,'WeChat(M)' ,'P2P' ,'BitTorrent Series' ,'DirectConnect' ,'eDonkey Series' ,'FastTrack' ,'Gnutella' ,'Foxy' ,'Winny' ,'POCO' ,'ClubBox' ,'Vagaa' ,'Share' ,'Thunder Series' ,'myMusic' ,'QQDownload' ,'easyMule' ,'Fileguri' ,'Soulseek' ,'GNUnet' ,'XNap' ,'Kceasy' ,'Aria2' ,'Arctic' ,'Artemis' ,'Bitflu' ,'BTG' ,'Pando' ,'Lphant' ,'BitBlinder' ,'Deepnet Explorer' ,'aMule' ,'Ares' ,'Azureus' ,'BCDC++' ,'BitBuddy' ,'BitComet' ,'ApexDC++' ,'Bearshare' ,'BitLord' ,'BT++' ,'Shareaza' ,'eMule' ,'eMule Plus' ,'FileScope' ,'GoGoBox' ,'Hydranode' ,'BitTorrent Pro' ,'Kazaa Lite Tools K++' ,'BitRocket' ,'MlDonkey' ,'MooPolice' ,'Phex' ,'RevConnect' ,'Rufus' ,'SababaDC' ,'Shareaza Plus' ,'BTSlave' ,'TorrentStorm' ,'uTorrent' ,'ZipTorrent' ,'BitPump' ,'BBtor' ,'Tuotu' ,'BitWombat' ,'Vuze' ,'Bittorrent X' ,'DelugeTorrent' ,'CTorrent' ,'Propagate Data Client' ,'EBit' ,'Electric Sheep' ,'FileCroc' ,'FoxTorrent' ,'GSTorrent' ,'Hekate' ,'Halite' ,'hMule' ,'KGet' ,'KTorrent' ,'LeechCraft' ,'LH-ABC' ,'libTorrent' ,'LimeWire' ,'Meerkat' ,'MonoTorrent' ,'MoonlightTorrent' ,'Net Transport' ,'OneSwarm' ,'OmegaTorrent' ,'Protocol::BitTorrent' ,'PHPTracker' ,'qBittorrent' ,'Qt 4 Torrent example' ,'Retriever' ,'RezTorrent' ,'Swiftbit' ,'SoMud' ,'SwarmScope' ,'SymTorrent' ,'Sharktorrent' ,'Terasaur Seed Bank' ,'TorrentDotNET' ,'Transmission' ,'uLeecher' ,'BitLet' ,'FireTorrent' ,'XSwifter' ,'XanTorrent' ,'Xtorrent' ,'Pruna' ,'Soribada' ,'Gample' ,'DIYHARD' ,'LottoFile' ,'ShareBox' ,'Bondisk' ,'Filei' ,'KDISK' ,'Ondisk' ,'FILEJO' ,'FILEDOK' ,'Santa25' ,'Webhard' ,'TPLE' ,'DiskPump' ,'NETFOLDER' ,'QFILE' ,'DISKMAN' ,'DBGO' ,'Congaltan' ,'Diskpot' ,'Ipopclub' ,'Yesfile' ,'Nedisk' ,'Me2disk' ,'Odisk' ,'Tomfile' ,'Adrive.co.kr' ,'ZIOfile' ,'APPLEFILE' ,'SUPERDOWN' ,'Hidisk' ,'Downs' ,'DownDay' ,'BOMULBOX' ,'FILEHAM' ,'Tdisk' ,'Filehon');
	$os_name = array('Acorn Computers', 'Amiga Inc.', 'Apple Inc.', 'Apollo Computer', 'Atari', 'BAE Systems', 'Be Inc.', 'Bell Labs', 'Bull SAS', 'Burroughs Corporation', 'Control Data Corporation', 'Convergent Technologies', 'Data General', 'DataPoint', 'DDC-I, Inc.', 'Digital Research, Inc.', 'Digital/Tandem Computers/Compaq/HP', 'ENEA AB', 'Fujitsu', 'Google', 'Green Hills Software', 'Heathkit/Zenith Data Systems', 'Hewlett-Packard', 'Honeywell', 'Intel Corporation', 'IBM', 'LynuxWorks <br/>(originally Lynx <br />Real-time Systems)', 'Micrium Inc.', 'Microsoft Corporation', 'MontaVista Software', 'NCR Corporation', 'Novell', 'Quadros Systems', 'RCA', 'RoweBots', 'Samsung Electronics', 'SCO / The SCO Grouparray(3)', 'Scientific Data <br />Systems (SDS)', 'SYSGO', 'TRON Project', 'Unisys', 'UNIVAC (later Unisys)', 'Wang Laboratories', 'Wind River Systems');
	$host = array('barrel-of-knowledge.info', 'barrell-of-knowledge.info', 'better-than.tv', 'blogdns.org', 'blogsite.org', 'boldlygoingnowhere.org', 'dnsalias.org', 'dnsdojo.org', 'doesntexist.org', 'dontexist.org', 'doomdns.org', 'dvrdns.org', 'dynalias.org', 'dyndns.info', 'dyndns.org', 'dyndns.tv', 'dyndns.ws', 'for-our.info', 'forgot.her.name', 'forgot.his.name', 'from-me.org', 'ftpaccess.cc', 'game-host.org', 'game-server.cc', 'go.dyndns.org', 'gotdns.org', 'groks-the.info', 'groks-this.info', 'here-for-more.info', 'hobby-site.org', 'home.dyndns.org', 'homedns.org', 'homeftp.org', 'x.org', 'homeunix.org', 'is-a-bruinsfan.org', 'is-a-candidate.org', 'is-a-celticsfan.org', 'is-a-chef.org', 'is-a-geek.org', 'is-a-knight.org', 'er.org', 'fan.org', 'is-a-soxfan.org', 'is-found.org', 'is-lost.org', 'is-saved.org', 'is-very-bad.org', 'is-very-evil.org', 'is-very-good.org', 'is-very-nice.org', 'is-very-sweet.org', 'isa-geek.org', 'kicks-ass.org', 'knowsitall.info', 'ed.org', 'myphotos.cc', 'on-the-web.tv', 'podzone.org', 'readmyblog.org', 'scrapping.cc', 'selfip.info', 'selfip.org', 'sellsyourhome.org', 'servebbs.org', 'serveftp.org', 'servegame.org', 'stuff-4-sale.org', 'webhop.info', 'webhop.org', 'worse-than.tv');
	$vendor = array(array('0','android'),array('1','mac'),array('2','ubuntu'),array('3','windows'));


	$Totalcat = count($app_cat);
	$vendor_count = count($vendor);
        foreach($app_cat AS $rowNum => $row){
        //foreach($rows AS $rowNum => $row){
            //If cell's elements have named keys, they must match column names
            //Only cell's with named keys and matching columns are order independent.
		$mac_id = "00:16:b2:dc:30:" .  str_pad(dechex($rowNum % (25)), 2, "0", STR_PAD_LEFT);
		$host	= $host_name[$rowNum % $Totalcat];
		$app_id = ceil((mt_rand()/mt_getrandmax()) * $Totalcat);
		$os_vendor_id = ($rowNum % $vendor_count);

		$down = array((mt_rand()/mt_getrandmax()) * 100, (mt_rand()/mt_getrandmax())* 1000, (mt_rand()/mt_getrandmax())* 20000);
		$up   = array((mt_rand()/mt_getrandmax()) * 50,  (mt_rand()/mt_getrandmax()) * 100,  (mt_rand()/mt_getrandmax()) * 1000 );
		asort($down);
		asort($up);
		//var id = Ext.String.format( '{0}|{1}|{2}', mac_id.replace(/:/g, '_'), cat_id, app_id);

            $entry = array('id' => $rowNum,
                'mac'=> str_replace(":", "_", $mac_id),
                'cell'=>array(
                    'employeeID'       => "test_" . $rowNum . "___" .rand(),
                    'name'             => $row['name'],
                    'primary_language' => $row['primary_language'],
                    'favorite_color'   => $row['favorite_color'],
		    'favorite_pet'     => $row['favorite_pet'],
		    'host'		=>	$host,
		    'mac'		=>	$mac_id,
		    'ipv4'		=>	"192.168.20." . ($rowNum + 1),
		    'app_id'		=>	$app_id,
		    'app_name'		=>	$app_name[$app_id],
		    'os_vendor_id'	=>	$os_vendor_id,
		    'os_vendor'		=>	$os_name[$os_vendor_id],
		    'cat_id'		=>	$row[0] % 6,
		    'down_rate'     =>  (mt_rand()/mt_getrandmax()) * 20,
		    'down_cfg_rate'=>  $down[1], 
		    'down_cfg_ceil'=>  $down[2],
		    'down_prio'    =>  (mt_rand()/mt_getrandmax()) * 1,
		    'down_sent'    =>  $down[0],
		    'down_sent_byte'=> (mt_rand()/mt_getrandmax()) * 0,
		    'up_rate'      =>  (mt_rand()/mt_getrandmax()) * 50,
		    'up_cfg_rate'  =>  $up[1], 
		    'up_cfg_ceil'  =>  $up[2],
		    'up_prio'      =>  (mt_rand()/mt_getrandmax()) * 1,
		    'up_sent'      =>  $up[0],
		    'up_sent_pkt'  =>  0
	    )
            );
            $jsonData['rows'][] = $entry;
        }
        //$jsonData['total'] = count($rows);
        $jsonData['total'] = $Totalcat;
        //add for user detail at once
	//echo json_encode($jsonData);
    //    exit;
	switch($_GET['action']){
	case "user":
		echo json_encode($jsonData);
		break;
    case "userdetail":
        $userdetail = array('rows'=>array());
        $index = array();
        $random = floor((mt_rand()/mt_getrandmax()) * 50)%25;
        foreach($jsonData['rows'] as $k=>$v){
            if($k > $random){break;}
            //if($k > 25){break;}
            $cell = $v['cell'];
            if((array_search($cell['mac'], $index))!==false){
            }
            else{
                $entry = array('id' => $k,
                'mac'=> str_replace(":", "_", $cell['mac']),
                'cell'=>array(
                    'employeeID'       => "test_" . $rowNum . "___" .rand(),
                    'host'		=>	$cell['host'],
                    'mac'		=>	$cell['mac'],
                    'ipv4'		=>	$cell['ipv4'],
                    'os_vendor_id'	=>	$cell['os_vendor_id'],
                    'uptime'     =>  floor(mt_rand()/mt_getrandmax() * 200),
                    //'uptime'     =>  time() + floor(mt_rand()/mt_getrandmax() * 1000) ,
                    'devicepriority'   => floor((mt_rand()/mt_getrandmax())*10)%6,
                    'upload'    =>  floor(mt_rand()),
                    'download'    =>  floor(mt_rand())
                )
                );
                    array_push($index, $cell['mac']);
                    array_push($userdetail['rows'], $entry);
            }
        }
        $userdetail['total'] = count($userdetail['rows']);
		echo json_encode($userdetail);
		break;
	default:
		//for($i=intval($_POST[''])
		//var_dump($jsonData);
		echo json_encode($jsonData);
	}
}
