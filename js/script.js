window.onload = function(){
	var diyUrl = document.getElementById("diyUrl");
	var addBtn = document.getElementById("addBtn");
	var yesBtn = document.getElementById("yesBtn");
	var list = document.getElementById("urlList");
	var listContent = list.getElementsByTagName("li");	//获取li元素
	var warning = document.getElementById("warning1");
	var warningRe = document.getElementById("warning2");
	var item = [];	//存放网址的数组

	//用正则检查url格式是否正确的函数
	function checkUrl(url){
		var pattern = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/g;
		return pattern.test(url);
	}

	//检查url是否重复函数
	function checkRepeat(url, arr){
		var flag = true;
		for (i=0;i<arr.length;i++)
			if (url == arr[i]) flag = false;
		return flag?true:false;
	}

	//改变url背景颜色的函数
	function changeColor(newA, level){ //参数Aobj是元素<a>，level是它的信任等级
		if (level < 3) newA.setAttribute("style","background-color:white");
		else if(3 <= level && level < 6) newA.setAttribute("style","background-color:#93FF93");
		else if(6 <= level && level < 9) newA.setAttribute("style","background-color:#53FF53");
		else if(9 <= level && level < 12) newA.setAttribute("style","background-color:#28FF28");
		else if(level >= 12) newA.setAttribute("style","background-color:#00DB00");
	}

	//点击【添加】事件
	addBtn.onclick = function(){

		if (checkUrl(diyUrl.value)){	//用正则检查url格式是否正确

			if (checkRepeat(diyUrl.value, item)){ //检查url是否重复	true表示没有重复
				warningRe.setAttribute("style","display:none");//把警告删去		
				item.push(diyUrl.value);	//如果没重复就加入数组

				//url显示（如果url格式没错，也不重复的话，就显示出来）
				warning.setAttribute("style","display:none");//把警告删去

				var newLi = document.createElement("li");
				var newA = document.createElement("a");

				newLi.appendChild(newA);
				list.appendChild(newLi);
				newA.setAttribute("href", diyUrl.value);
				newA.setAttribute("target", "_blank");

				newA.innerHTML = diyUrl.value;
			}
			else{
				warningRe.setAttribute("style", "display:block");
			}
		}
		else{
			warning.setAttribute("style","display:block");//显示警告
		}
	}


	//点击【确定】事件，显示title，img，内容摘要
	yesBtn.onclick = function(){
		
		var request = new XMLHttpRequest();
		request.open("GET", "eg.json", true);
		request.send();
		request.onreadystatechange = function()
		{
			if (request.readyState==4 && request.status==200)
			{
				var jsonFile = eval("("+request.responseText+")"); //把json转换成js
				//document.getElementById("userId").innerHTML = jsonFile.user[0].userId;
				for (i=0;i<item.length;i++)
				{

					//url的背景颜色
					changeColor(listContent[i].getElementsByTagName("a")[0], jsonFile.urlContent[i].level);

					//创建true和false按钮
					if (!document.getElementById(item[i] + "btnYes") && !document.getElementById(item[i] + "btnNo")){
						var newBtn_Yes = document.createElement("input");
						var newBtn_No = document.createElement("input");
						newBtn_Yes.setAttribute("type", "button");
						newBtn_Yes.setAttribute("value", "True");
						newBtn_Yes.setAttribute("id", item[i] + "btnYes");
						newBtn_No.setAttribute("type", "button");
						newBtn_No.setAttribute("value", "False");
						newBtn_Yes.setAttribute("id", item[i] + "btnNo");
						listContent[i].appendChild(newBtn_Yes);
						listContent[i].appendChild(newBtn_No);
					}


					//获取title
					if (!document.getElementById(item[i]+"title")){
						var newNode_Title = document.createElement("p");//创建一个新节点
						newNode_Title.setAttribute("id", item[i]+"title");
						newNode_Title.innerHTML = "Title: " + jsonFile.urlContent[i].Title;//获取json内容到新节点中
						listContent[i].appendChild(newNode_Title);//把新节点变成li中的一个子节点						
					}

					//获取img
					if (!document.getElementById(item[i]+"img")){
						var newNode_img = document.createElement("img");//创建一个新节点
						newNode_img.setAttribute("id", item[i]+"img");
						newNode_img.setAttribute("src", jsonFile.urlContent[i].img);//获取json内容到新节点中
						listContent[i].appendChild(newNode_img);//把新节点变成li中的一个子节点
					}	
					//获取内容摘要
					if (!document.getElementById(item[i]+"content")){
						var newNode_content = document.createElement("p");//创建一个新节点
						newNode_content.setAttribute("id", item[i]+"content");
						newNode_content.innerHTML = "内容摘要: " + jsonFile.urlContent[i].content;//获取json内容到新节点中
						listContent[i].appendChild(newNode_content);//把新节点变成li中的一个子节点
					}
				}
			}
		}		
	}

}

