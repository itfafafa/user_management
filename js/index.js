var username // 用户名
var userage // 用户年龄
var userid // 用户 id
var isAdd = true // 增加标记
var refreshflag = false // 刷新成功标记
var delId // 需要删除的id
var se // 定时器
allUser() // 进入页面执行一次查询
// 导出表格
function toExcel() {
  //window.location.href='<%=basePath%>pmb/excelShowInfo.do';
  //获取表格
  var exportFileContent = document.getElementById("userTable").outerHTML;
  //设置格式为Excel，表格内容通过btoa转化为base64，此方法只在文件较小时使用(小于1M)
  //exportFileContent=window.btoa(unescape(encodeURIComponent(exportFileContent)));
  //var link = "data:"+MIMEType+";base64," + exportFileContent;
  //使用Blob
  var blob = new Blob([exportFileContent], { type: "text/plain;charset=utf-8" });     	//解决中文乱码问题
  blob = new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
  //设置链接
  var link = window.URL.createObjectURL(blob);
  var a = document.createElement("a");    //创建a标签
  a.download = `用户信息表${new Date().getTime()}.xls`;  //设置被下载的超链接目标（文件名）
  a.href = link;                            //设置a标签的链接
  document.body.appendChild(a);            //a标签添加到页面
  a.click();                                //设置a标签触发单击事件
  document.body.removeChild(a);            //移除a标签
}
// 刷新表格
async function refresh() {
  await allUser()
  if(refreshflag) {
    tipPupop(true, '刷新成功！')
    refreshflag = false
  } else {
    tipPupop(false, '刷新失败！')
  }
}
// 查询所有用户
function allUser() {
  $.get('http://127.0.0.1/userInfo', (res) => {
    refreshflag = true
    $('.trBody').remove() // 先清空再渲染
    $.each(res, (index, e) => {
      var n = index + 1
      $('#userTable').append(`
        <tr class="trBody">
          <td align="center" width="30"><input type="checkbox" name="itemCheck" onclick="itemCheck()" userId="${e.id}" id=""></td>
          <td align="center" width="50">${n}</td>
          <td align="center" width="110">${e.username}</td>
          <td align="center" width="80">${e.userage}</td>
          <td align="center" width="110">
            <a onclick="editUserBtn('${e.id}','${e.username}','${e.userage}')" class="editUser" href="javascript:;" userId="${e.id}">编辑</a>
            &nbsp; &nbsp;
            <a onclick="delUser(this)" class="delUser" href="javascript:;" userId="${e.id}">删除</a>
          </td>
        </tr>
      `)
    })
  })
}
// 点击新增用户
function addUserBtn() {
  isAdd = true
  $('#poptitle').html('新增用户')
  $('.pupopBox').show()
  $('#usernameInp').focus()
}
function pupopHide() {
  $('.pupopBox').hide()
  $('.pupopInp').val('')
}
// 点击确定新增用户
function addUser() {
  if (isAdd) {
    username = $('#usernameInp').val()
    userage = $('#userageInp').val()
    if (username.trim() == '' || userage.trim() == '') {
      tipPupop(false, '姓名或年龄不能为空！')
      return false
    }
    if(username.toString().length > 9) {
      tipPupop(false, '姓名请输入9个字以内！')
      return false
    }
    if(userage.toString().length > 10) {
      tipPupop(false, '年龄过大！')
      return
    }
    var data = { 'username': username, 'userage': userage }
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1/addUser',
      dataType: 'json',
      data: data,
      success: function (res) {
        allUser()
        $('.pupopBox').hide()
        $('.pupopInp').val('')
        tipPupop(true, '新增成功！')
        setTimeout(()=>{
          var d = $('.tdbox')[0]
          d.scrollTop = d.scrollHeight; //滚动条置底，便于显示最新内容
        },100)
      }
    })
  } else {
    username = $('#usernameInp').val()
    userage = $('#userageInp').val()
    if (username.trim() == '' || userage.trim() == '') {
      tipPupop(false, '姓名或年龄不能为空！')
      return false
    }
    if(username.toString().length > 9) {
      tipPupop(false, '姓名请输入9个字以内！')
      return false
    }
    if(userage.toString().length > 10) {
      tipPupop(false, '年龄过大！')
      return
    }
    var data = { 'id': userid, 'username': username, 'userage': userage }
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1/editUser',
      dataType: 'json',
      data: data,
      success: function (res) {
        allUser()
        $('.pupopBox').hide()
        $('.pupopInp').val('')
        tipPupop(true, '编辑成功！')
      }
    })
  }

}
// 删除用户
function delUser(t) {
  $('.delPupopMask').show()
  delId = $(t).attr('userId')
}
// 批量删除
function batchDel() {
  const useridArr = []
  $('input[name=itemCheck]:checked').each((index,item) => {
    useridArr.push(item.getAttribute('userId'))
  })
  delId = useridArr.join(',')
  if(delId == '') {
    tipPupop(false, '请选择需要删除的用户!')
    return
  }
  $('.delPupopMask').show()
}
// 取消删除
function delClose() {
  $('.delPupopMask').hide()
}
// 确定删除
function sureDel() {
  $.ajax({
    type: 'DELETE',
    url: 'http://127.0.0.1/delUser?userId=' + delId,
    success: function (res) {
      console.log('del')
      allUser()
      tipPupop(true, '删除成功！')
      $('.delPupopMask').hide()
    }
  })
}
// 编辑用户
function editUserBtn(id, username, userage) {
  isAdd = false
  userid = id
  $('.pupopBox').show()
  $('#poptitle').html('编辑用户')
  $('#usernameInp').val(username)
  $('#userageInp').val(userage)
}
// 搜索用户
function seachUser() {
  var seachusername = $('.seachInp').val()
  $.get('http://127.0.0.1/seachUser?username=' + seachusername, (res) => {
    if (res == '') {
      tipPupop(true, '暂无数据')
    }
    $('.seachInp').val('')
    $('.trBody').remove() // 先清空再渲染
    $.each(res, (index, e) => {
      var n = index + 1
      $('#userTable').append(`
        <tr class="trBody">
          <td align="center" width="30"><input type="checkbox" name="itemCheck" onclick="itemCheck()" userId="${e.id}" id=""></td>
          <td align="center" width="50">${n}</td>
          <td align="center" width="110">${e.username}</td>
          <td align="center" width="80">${e.userage}</td>
          <td align="center" width="110">
            <a onclick="editUserBtn('${e.id}','${e.username}','${e.userage}')" class="editUser" href="javascript:;" userId="${e.id}">编辑</a>
            &nbsp; &nbsp;
            <a onclick="delUser(this)" class="delUser" href="javascript:;" userId="${e.id}">删除</a>
          </td>
        </tr>
      `)
    })
  })
}
// 提示弹窗
function tipPupop(p, tip) {
  if (p) {
    clearTimeout(se)
    $('.tipPupop').html(tip)
    $('.tipPupop').css({ 'top': '2px', 'background-color': 'rgba(170, 236, 146, .8)' })
    $('.tipPupop').animate({ opacity: .9, top: '11px' })
    se = setTimeout(function () { $('.tipPupop').animate({ opacity: 0 }) }, 1000)
  } else {
    clearTimeout(se)
    $('.tipPupop').html(tip)
    $('.tipPupop').css({ 'top': '2px', 'background-color': 'rgba(236, 146, 146, 0.8)' })
    $('.tipPupop').animate({ opacity: .9, top: '11px' })
    se = setTimeout(function () { $('.tipPupop').animate({ opacity: 0 }) }, 1000)
  }

}
// 点击全选
function allCheckOrAllUncheck() {
  const allcheck = $('input[name=allCheck]').prop('checked')
  if(allcheck) {
    $('input[type=checkbox]').prop('checked', true)
  } else {
    $('input[type=checkbox]').prop('checked', false)
  }
}
// 点击单选
function itemCheck() {
  const allitem = $('input[name=itemCheck]')
  const itemcheck = $('input[name=itemCheck]:checked')
  if(itemcheck.length == allitem.length) {
    $('input[name=allCheck]').prop('checked', true)
  } else {
    $('input[name=allCheck]').prop('checked', false)
  }
}