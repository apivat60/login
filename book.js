  function waiting(){
     Swal.fire({ title: 'loading..' });
      Swal.showLoading();
    setTimeout(() =>{
      Swal.close();
        },2000)
  }
//<-- -----------------------------------------โหลดข้อมูลผู้ใช้มาเก็บไว้ก่อน -->
  var datalogin,scripturl
  google.script.run.withSuccessHandler((result) => {
    datalogin = result

    // console.log(datalogin)
  }).searchData('user')

//<-- -----------------------------------------สคริปต์รีโหลดหน้าเว็บ -->
  google.script.run.withSuccessHandler(function (url) {
    scripturl = url
  }).getURL();

//<-- -------------------------------------กรณีที่มีการรีโหลดหน้าเว็บ ให้มาเช็คข้อมูลจาก sessionStorage
  let status, name, user_save, token
  window.addEventListener('load', function () {
    
    status = sessionStorage.getItem("Status");
    name = sessionStorage.getItem("Name");
    datauser = sessionStorage.getItem("Datauser");
    console.log('สถานะ ' + status)
    // notification(name)
    if (status === null) {
      welcome()
      $('#nav-btn3').addClass('d-none')
      google.script.run.withSuccessHandler(searchData).searchData('data')
    } else if (status == "admin") {
      waiting()
      showUserTable({name: false, admin: true})
      $('#logoutbtn').show()
      $('#loginbtn').hide()
      $('#nameAdmin').text(name)
      $('#showname').show()
      $('#sendbtn').show()
      $('#commandbtn').show()
      $('#announcebtn').show()
      
// <-- ------------------------------ปุ่มเรียกฟอร์ม -->
     $('#nav-btn').removeClass('d-none')
     $('#nav-btn2').addClass('d-none')
     $('#nav-btn3').removeClass('d-none')
      console.log('ผู้เข้าระบบ ชื่อ ' + name)
    } else {
      waiting()
       $('#nav-btn').addClass('d-none')
       $('#nav-btn2').removeClass('d-none')
       $('#nav-btn3').removeClass('d-none')
   google.script.run.withSuccessHandler((result) => {
    dataSend = result
    showUserTable({name: name})
      $('#logoutbtn').show()
      $('#loginbtn').hide()
      $('#nameAdmin').text(name)
      $('#showname').show()
      $('#addbtn').hide()
      $('#sendbtn').hide()
      $('#commandbtn').hide()
      $('#announcebtn').hide()
      $('#recordbtn').show() //ปุ่มเมนูบันทึกข้อความ
      console.log('ผู้เข้าระบบ ชื่อ ' + name)
      
  }).searchData(name)
      
    }
  })

//<-- ------------------------------------ปุ่มรับหนังสือภายนอก -->
  $('#nav-btn').click(function(){
    addform1()
  })

//<-- ------------------------------------ปุ่มเพิ่มหนังสือบันทึก -->
  $('#nav-btn2').click(function(){
    addform5()
  })

//<-- ------------------------------------ฟอร์ม Logout -->
  function logout() {
    Swal.fire({
      position: 'top',
      title: 'คุณต้องการออกจากระบบ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ตกลง'

    }).then((result) => {

      if (result.isConfirmed) {
        reLoad()
        Swal.fire({ title: 'รอสักครู่..' });
        Swal.showLoading();

        sessionStorage.removeItem("Status");
        sessionStorage.removeItem("Name");
        sessionStorage.removeItem("Datauser");
      }
    })
  }

//<-- ------------------------------------ฟอร์ม Login -->
  function loginform() {
    Swal.fire({
      title: 'ลงชื่อเข้าใช้งาน',
      html: `<input type="text" id="user" class="swal2-input" placeholder="ชื่่อผู้ใช้"><input type="password" id="pass" class="swal2-input" placeholder="รหัสผ่าน">`,
      confirmButtonText: 'ตกลง',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonText: 'No',
      focusConfirm: true,
      preConfirm: () => {

        const user = Swal.getPopup().querySelector('#user').value
        const pass = Swal.getPopup().querySelector('#pass').value
        let rowindex = datalogin.filter(r => r[4] == user && r[5] == pass)

        if (!user || !pass) {
          Swal.showValidationMessage(`กรุณากรอกข้อมูลให้ครบ`)
        } else {
          if (rowindex != "") {
            console.log('ชื่อผู้เข้าสู่ระบบ คือ ' + rowindex[0][1])
            
            user_save = rowindex[0][1]

            $('#nameAdmin').text(rowindex[0][1])
            $('#showname').show()
            $('#logoutbtn').show()
            $('#sendbtn').show()
            $('#commandbtn').show()
            $('#announcebtn').show()
            $('#recordbtn').show() //เมนู sidebar บันทึกข้อความ
            $('#loginbtn').hide()
            $('#homebtn').addClass('active');
            sessionStorage.setItem("Status", rowindex[0][6]);
            sessionStorage.setItem("Name", rowindex[0][1]);
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลงชื่อเข้าใช้สำเร็จ!!!',
              showConfirmButton: false,
              timer: 1500
            })
            // notification(rowindex[0][1])
           $('#nav-btn3').removeClass('d-none')
//<-- -----------------------------กรณีที่ลงชื่อเข้าใช้เป็น Admin -->
            if(rowindex[0][6] == 'admin'){
               $('#nav-btn').removeClass('d-none')
               $('#nav-btn2').addClass('d-none')
                
                waiting()
           //    $('#nav-btn').text('เพิ่มข้อมูล').attr('data-form', 'formAdd').removeClass('d-none')
            showUserTable({name: rowindex[0][1],admin:true})
            console.log('data '+rowindex[0][1])
            }else{
               $('#nav-btn').addClass('d-none')
               $('#nav-btn2').removeClass('d-none')
              waiting()
//<-- -----------------------------กรณีที่ลงชื่อเข้าใช้เป็น User -->
               google.script.run.withSuccessHandler((result) => {
                  dataSend = result
                    showUserTable({name: rowindex[0][1],admin:false})
                    console.log('data '+rowindex[0][1])
                }).searchData(rowindex[0][1])
            }
          } else {
            Swal.close()
            Swal.fire({
              position: 'top',
              icon: 'error',
              title: 'คุณใส่รหัสผ่านไม่ถูกต้อง',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }
      }
    })
  }

//<-- -----------------------------แแสดงตาราง -->
  function showUserTable({name,admin}) {
    if (admin) {
      $('#table1').show() //แสดงตารางหนังสือรับ
      $('#table2').hide()
      $('#table3').hide()
      $('#table4').hide()
      $('#table5').hide()
      $('#table6').hide()
      $('#recordbtn').hide()
      $('#homebtn').addClass('active');
      google.script.run.withSuccessHandler(searchData).searchData('data')
      return
      
    } else {
      if(!dataSend || !dataSend2){
        setTimeout(() =>{
          showUserTable({name})
        },200)
        return
      }
      $('#table1').hide() //แสดงตารางทั้งหมด
      $('#table2').show()
       $('#table3').hide() //ซ่อนตารางหนังสือส่ง
      $('#table4').hide() //ซ่อนตารางคำสั่ง
      $('#table5').hide() //ซ่อนตารางประกาศ
      $('#homebtn').hide() // -----------------------ซ่อนปุ่ม home ถ้า user login เข้ามา
      $('#bookinbtn').show() // ------------------ แสดงปุ่มหนังสือภายใน ------>
      $('#bookinbtn').addClass('active');

      let rowdata = dataSend.filter(r => r[13] == name) //ค้นหาข้อมูลตามชื่อที่แทงหนังสือในชีต send คอลัมน์ที่ 13
          searchDataS(rowdata) //เรียกฟังก์ชั่นไปค้นหาข้อมูลเพื่อแสดงตาราง tableSend ของแต่ละกอง ที่ login เข้ามา

      let rowdata2  = dataSend2.filter(r => r[7] == name) //ค้นหาข้อมูลตามชื่อผู้ปฏิบัติในชีต บันทึก คอลัมน์ที่ 7
          searchDataS2(rowdata2)
showUserTable
      sessionStorage.setItem("Datauser", rowdata);
      //console.log(rowdata)
      $('#addbtn').hide()
      $('#sendbtn').hide()
      $('#commandbtn').hide()
      $('#announcebtn').hide()
      $('#table6').hide()
    }
  }
//searchData
//<-- --------------------------------------รีโหลดเว็บ -->
  function reLoad() {
      window.open(scripturl, '_top');
  }

//<-- --------------------------------------โหลด -->
  function loadBookIn() {
      Swal.fire({ title: 'รอสักครู่..กำลังโหลดข้อมูล' });
        Swal.showLoading();
        reLoad()
  }

//<-- --------------------------------------แสดงฟอร์ม Modal หนังสือรับ -->
  function addform1() {
    event.preventDefault();
    setForm('add', 'ฟอร์มหนังสือรับ')
    toggleFormInput(false)
    $('#modal_form1').modal('show')
    // $('#addbtn').removeClass('hide');
    // $('#addbtn').addClass('active');
  }

//<-- --------------------------------------แสดงฟอร์ม Modal หนังสือส่ง -->
  function addform2() {
    event.preventDefault();
    setForm('send', 'ฟอร์มหนังสือส่ง')
    $('#closeModal1').click()
    $('#modal_form1').modal('show')
  }

//<-- ----------------------------------แสดงฟอร์ม Modal หนังสือส่งคำสั่ง -->
  function addform3() {
    event.preventDefault();
    setForm('command', 'ฟอร์มคำสั่ง')
    $('#closeModal1').click()
    toggleFormInput(['#input3','#input4'])
    $('#modal_form1').modal('show')
  }

//<-- -----------------------------------แสดงฟอร์ม Modal หนังสือประกาศ -->
  function addform4() {
    event.preventDefault();
    setForm('announce', 'ฟอร์มประกาศ')
    $('#closeModal1').click()
    toggleFormInput(['#input3','#input4'])
    $('#modal_form1').modal('show')
  }

//<-- ------------------------------แสดงฟอร์ม Modal หนังสือบันทึกข้อความ -->
  function addform5() {
    event.preventDefault();
    setForm('record', 'ฟอร์มบันทึกข้อความ')
    toggleFormInput(false)
    $('#closeModal1').click()
    $('#modal_form1').modal('show')
  }

//<-- ------------------------------แสดงชื่อฟอร์ม -->
  function setForm(target,title){
    $('#targetFunc').val(target)
    $('#form-title').text(title)
  }

//<-- ------------------------------แสดงตาราง -->
  function toggleTable(table){
    $('#table1,#table2,#table3,#table4,#table5,#table6').hide()
    $(table).show()
  }

//<-- ------------------------------แสดง/ซ่อน Input -->
  function toggleFormInput(inputs){
    $('input, select, textarea').not('[type="file"]').not('.hide').prop('required',true)
    $('.ishide').removeClass('ishide').show()
    if(!inputs) return
    $(inputs.join(',')).each(function(){
      $(this).prop('required', false).parent().addClass('ishide').hide()
      $('label[for="'+$(this).attr('id')+'"]').addClass('ishide').hide()
    })
  }

//<-- -----------------------------------------แสดงตารางหนังสือส่ง -->
    function showTableDataPost() {
    event.preventDefault();
    toggleTable('#table3')
    $('#nav-btn-a').removeClass('d-none')
    $('#nav-btn-b').addClass('d-none')
    $('#nav-btn-c').addClass('d-none')
    $('#nav-btn').addClass('d-none')
  }

//<-- -----------------------------------------แสดงตารางหนังสือคำสั่ง -->
    function showTableDataCommand() {
    event.preventDefault();
    toggleTable('#table4')
    $('#nav-btn-b').removeClass('d-none')
    $('#nav-btn-a').addClass('d-none')
    $('#nav-btn-c').addClass('d-none')
    $('#nav-btn').addClass('d-none')
  }

//<-- -----------------------------------------แสดงตารางหนังสือประกาศ -->
    function showTableAnnouce() {
    event.preventDefault();
    toggleTable('#table5')
    $('#nav-btn-c').removeClass('d-none')
    $('#nav-btn-a').addClass('d-none')
    $('#nav-btn-b').addClass('d-none')
    $('#nav-btn').addClass('d-none')
  }

//<-- -----------------------------------------แสดงตารางหนังสือบันทึกข้อความ/แทงหนังสือภายใน -->
    function showTableRecord() {
    event.preventDefault();
    toggleTable('#table6')
  }


    function showTableDataSend() {
    event.preventDefault();
    toggleTable('#table2')
  }

//<-- --------------------------------------------------แสดงหน้าหลัก -->
    function home() {
    event.preventDefault();
    toggleTable('#table1')
    $('#nav-btn').removeClass('d-none')
    $('#nav-btn-c').addClass('d-none')
    $('#nav-btn-a').addClass('d-none')
    $('#nav-btn-b').addClass('d-none')
  }

//<-- ---------------------------------------------ทำแถบสีเมนูที่คลิกเลือก -->
$('.sidebar-nav').on('click', 'li', function() {
    $('.sidebar-nav li.active').removeClass('active');
    $(this).addClass('active');
});

$('.modal')
.on('hidden.bs.modal',function(){
  $(this).find('form').trigger('reset').find('textarea').val('')
})
.on('shown.bs.modal',function(){
  $(this).find('form').find('.form-control, .form-select').first().focus()
})


$('#nav-btn-a').on('click',function() {
  addform2()
})
$('#nav-btn-b').on('click',function() {
  addform3()
})
$('#nav-btn-c').on('click',function() {
  addform4()
})
//<-- ------------------------------------บันทึกลงชีต หนังสือรับ(จากภายนอก) -->
  const saveForm = (obj) =>  {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        // $('#token').val(token)
        if(user!=""){
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
         google.script.run.withSuccessHandler(function(outputx){
          console.log('ok'+outputx)
          updateTable('#datatable', outputx)
      }).saveData(obj) 
        }else{
             Swal.fire('กรุณาเข้าระบบ')
        }
  }

//<-- ------------------------------------บันทึกลงชีต หนังสือส่ง -->
  const saveFormPost = (obj) =>  {
        event.preventDefault()

        // let user = $('#nameAdmin').text()
        // if(user!=""){
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
         google.script.run.withSuccessHandler(function(outputx){
             updateTable('#datatablepost',outputx)
            // loadBookIn()
      }).saveDataPost(obj) 
  }

//<-- ------------------------------------บันทึกลงชีต หนังสือคำสั่ง -->
  const saveFormCommand = (obj) =>  {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        // $('#token').val(token)
       // if(user!=""){
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
         google.script.run.withSuccessHandler(function(outputx){
          updateTable('#datatablecommand', outputx)
          console.log((outputx))
      }).saveDataCommand(obj) 
        }

//<-- ------------------------------------บันทึกลงชีต หนังสือประกาศ -->
  const saveFormAnnounce = (obj) =>  {
        event.preventDefault()
        // let user = $('#nameAdmin').text()
        // if(user!=""){
          // $('#token').val(token)
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
         google.script.run.withSuccessHandler(function(outputx){
          console.log(outputx)
          updateTable('#datatableannounce', outputx)
      }).saveDataAnnouce(obj) 
  }

//<-- ------------------------------------บันทึกลงชีต หนังสือบันทึกข้อความ(หนังสือภายใน) -->
  const saveFormRecord = (obj) =>  {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        if(user!=""){
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
        $('#user_save').val(user)
        // $('#token').val(token)
        //obj.user = user // ส่งตัวแปร user ไปกับ hidden input เพื่อไปบันทึกลงในคอลัมน์
        google.script.run.withSuccessHandler((outputx)=>{
          updateTable('#datatablerecord', outputx)

       }).saveBookRecord(obj) 
        }else{
             Swal.fire('กรุณาเข้าระบบ')
        }
  }

//<-- ---------------------------------------สวิตช์ฟอร์มเมื่อกดปุ่ม submit -->
  function processForm(data){
    let targetFunc = $('#targetFunc').val()
    console.log(targetFunc)
    switch(targetFunc){
      case 'add': saveForm(data); break;
      case 'send': saveFormPost(data); break;
      case 'command': saveFormCommand(data); break;
      case 'announce': saveFormAnnounce(data); break;
      case 'record': saveFormRecord(data); break;
      default: break;
    }
  }

  function updateTable(table,data){
    console.log(JSON.parse(data))
    $(table).DataTable().rows.add(JSON.parse(data)).draw(false)
    $('.modal').modal('hide')
    Swal.fire({
      icon: 'success',
      title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      showConfirmButton: false,
      timer: 1500
    } )
  }

  // ------------ ดึงข้อมูลจาก Modal ที่จะส่งไปบันทึกลงชีต send --------------//
  var row_dt
  function sendto(el) {
    let r = $(el).closest('tr')
    row_dt = $('#datatable').DataTable().row(r)
    clearlist()
    $('#exampleModal').attr('data-id', row_dt.data()[0])
    .modal('show')
    // let inputID = el.parentNode.parentNode.cells[1].innerHTML;  //รหัส
    let row = row_dt.data()
    console.log(row)
    $('#inputID').val(row[0])
    $('#input1').val(row[2])
    $('#input2').val(row[3])
    $('#input3').val(row[4])
    $('#input4').val(row[5])
    $('#input5').val(row[6])
    $('#input6').val(row[7])
    $('#input7').val(row[8])
    $('#input8').val(row[9])
    $('#input9').val(row[10])
    $('#input10').val(row[11])
    $('#input11').val(row[12])
    return

  }

// -----------------  เมื่อมีการรับหนังสือภายนอกแล้ว ให้ยืนยันการรับ------------//
function sendRecive(el){
  let r = $(el).closest('tr')
  row_dt = $('#tableSend').DataTable().row(r)
  //console.log(row_dt.data()[2])
  let id = row_dt.data()[2] //เลขคำสั่งหนังสือ
  let uname = row_dt.data()[13] //ผู้ปฏิบัติ
  console.log(id)
  console.log(uname)
  Swal.fire({
        title: 'ยืนยันการรับหนังสือ ??',
        showDenyButton: true,
        confirmButtonText: 'ใช่ ยืนยันเลย',
        denyButtonText: 'ไม่',
    }).then((result) => {
        if (result.isConfirmed) {
           $(el).removeClass('btn-danger').addClass('btn-success').html("<i class='bx bxs-user' ></i>")
      google.script.run.withSuccessHandler(()=>{
        Swal.fire('รับหนังสือเรียบร้อยแล้ว', '', 'success');
        google.script.run.withSuccessHandler(()=>{
          console.log('อัปเดตเปลี่ยนสีไอคอนเรียบร้อยแล้ว')
        }).updateAfterReciveBook(id,uname) //อัปเดตไอคอนหลังจากกดรับแล้ว
     }).reciveBook(id,uname)
       Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
       Swal.showLoading();
        } else if (result.isDenied) {
            Swal.fire('ยกเลิกการรับหนังสือ', '', 'info');
        }
    });
}


  google.script.run.withSuccessHandler(searchData2).searchData('user')
  function searchData2(item){
   if(item){
      let result2 = "<div><table class='table table-sm'>"+
                   "<thead class='bg-info'>"+
                     "<tr>"+ 
                       "<th width='2%'>ที่</th>"+
                       "<th width='50%'>ชื่อ/กลุ่ม/กอง</th>"+
                       "<th width='28%'>ตำแหน่ง</th>"+
                       "<th width='10%'>เลือก</th>"+
                       "<th class='hide'>line</th>"+
                     "</tr>"+
                  "</thead>";
          var n=1
           for(var i=0; i<item.length; i++) {
                result2 += "<tr>";
                result2 += '<td>'+ ([n]) + '</td>';   
                result2 += '<td>'+ (item[i][1]) + '</td>';   
                result2 += '<td>'+ (item[i][2]) + '</td>';
                result2 += '<td class="hide">'+ (item[i][3]) + '</td>';
                result2 += "<td> <button onclick='editData3(this)' class='btn btn-primary btn-sm me-1'>เลือก</button></td>" ;
                result2 += "</tr>";
                n++
      }
                result2 += "</table></div>";
                var div = document.getElementById('example2').innerHTML = result2;
   }
}

//<!-- -------------------------------------------ดึงข้อมูลใส่ในตัวแปร -->
function editData3(el){
    if($(el).data('select') == true){
      $(el).attr('data-select', false).parents('tr').removeClass('bg-warning-subtle')
    }else{
      $(el).attr('data-select', true).parents('tr').addClass('bg-warning-subtle')
    }
   inputName = el.parentNode.parentNode.cells[1].innerHTML;  
   lineuser = el.parentNode.parentNode.cells[3].innerHTML; 
   inputID = $('#inputID').val()
   input1 = $('#input1').val()
   input2 = $('#input2').val()
   input3 = $('#input3').val()
   input4 = $('#input4').val()
   input5 = $('#input5').val()
   input6 = $('#input6').val()
   input7 = $('#input7').val()
   input8 = $('#input8').val()
   input9 = $('#input9').val()
   input10 = $('#input10').val()
   input11 = $('#input11').val()
   addtocart()
 
}

 //<!-- -------------------------------------------นำข้อมูลที่ได้ใส่ในอะรย์ เพื่อจะส่งไปบันทึกลงชีต -->
var cart = [];
function addtocart() {
    var pass = true;
    console.log(inputName)
    if(pass) {
      if(cart.findIndex(a => a.inputName == inputName) > -1) return
        var obj = {
            inputID: inputID,
            input1: input1,
            input2: input2,
            input3: input3,
            input4: input4,
            input5: input5,
            input6: input6,
            input7: input7,
            input8: input8,
            input9: input9,
            input10: input10,
            input11: input11,
            inputName: inputName,
            lineuser: lineuser,
            
        };
        cart.push(obj)
        console.log(cart)
    }
        rendercart();
}

function clearlist() {
    cart = [];
   // $("#mycart").html(`<p>โปรดเลือกรายการ</p>`)
}

//<-- ------------------------------แสดงการเลือก ก่อนที่จะส่งข้อมูลไปบันทึก สามารถลบตัวเลือก และเลือกใหม่ได้-------------------- -->
function rendercart() {
    if(cart.length > 0) {
      let result = "<div><table >"+
                   "<thead class='bg-info'>"+
                     "<tr>"+ 
                       "<th width='10px'>ที่</th>"+
                       "<th width='100px'>แจ้งทราบ</th>"+
                       "<th width='10px'>ลบ</th>"+

                     "</tr>"+
                  "</thead>";
        var n=1
           for(var i=0; i<cart.length; i++) {
                result += "<tr>";
                result += '<td>'+ [n]+ '</td>';    
                result += '<td>'+ (cart[i].inputName) + '</td>';     
                result += '<td onclick="del(this)" data-menuid="+ (cart[i].inputID) +"><i class="bx bx-trash bx-sm text-danger"></i></td>';   
                result += "</tr>";
                n++
               
      }
         $("#mycart").html(result)
    }
}

// <!-- --------------------------------------------ลบตัวที่เลือก------------------ -->
function del(row,row_price){
  const tr = row.parentNode
  const menu_id = row.dataset.menuid
  var index = cart.findIndex(item => item.id === +menu_id);
  cart.splice(index, 1);
  tr.remove()

}

// <!-- --------------------------------------------------บันทึกเพื่อแทงหนังสือไปลงชีต------------------ -->
function saveFormSend(){
  let userAction = $('#userAction').val()
  if(userAction == ''){alert('กรอกด้วย') 
  return}
  let id = $('#inputID').val()
  console.log('id', id)
  let user = $('#nameAdmin').text()
  if(user!=""){
    //console.log('ผู้ได้รับมอบหมาย'+userAction)
  Swal.fire({ title: 'รอสักครู่..' });
  Swal.showLoading();
     google.script.run.withSuccessHandler((data)=>{
      row_dt.data(JSON.parse(data)[0]).draw(false)
     $('.modal').find('form').trigger('reset').find('textarea').val('')
     $('.modal').modal('hide')
     clearlist()
    Swal.fire({
      icon: 'success',
      title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      showConfirmButton: false,
      timer: 1500
    } )     
          }).saveDataSend(id,cart,userAction)
    }else{
      Swal.fire('กรุณาเข้าระบบ')
     }
    }

  //โหลดข้อมูลจากชีตหนังสือส่ง แสดงในตาราง datatable
  google.script.run.withSuccessHandler(dataTablePost).searchData('หนังสือส่ง')
  var dataArray
  function dataTablePost(item) {
    DataTable.Buttons.defaults.dom.button.className = 'btn';
    $('#table3').hide()
    if (!item) return
    dataArray = item
      $('#datatablepost').DataTable({
        //  dom: 'Bfrtip',
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"ip>',
         buttons: {
             buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fa fa-file-excel-o" style="font-size:20px ; background-color: #3ca23c"></i>',
            titleAttr: 'Excel'
          }
          // { extend: 'print'},
        ],
        dom: {
          button: {
               className: 'btn btn-success'
          },
          buttonLiner: {
               tag: null
          }
         }
    },
        data: item,
        columns: [
          {
            data: null,
            render: function (data, type, row, meta) {
                return "<button type='button' class='btn btn-success  btn-sm editBtn'><i class='bx bxs-user'></i></button>";
            }
          },
          { data: 0 },
          { data: 2 },
          { data: 3 },
          { data: 4 },
          { data: 5 },
          { data: 6 },
          { data: 7 },
          { data: 8 },
          { data: 9 },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[10] != '') {
                return "<a  href='" + (row[10]) + "'target='_blank' class='btn btn-primary  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[11] != '') {
                return "<a  href='" + (row[11]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[12] != '') {
                return "<a  href='" + (row[12]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
        ],
        destroy: true,    //ซ่อนคอลัม
        responsive: true,
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/th.json', },
        order: [[1, 'desc']],
        // columnDefs: [
        //         {targets: [0,1,3],className: 'all',},    
        //  ],
      });

  }

 google.script.run.withSuccessHandler(dataTableCommand).searchData('คำสั่ง')
  var dataArray
  function dataTableCommand(item) {
    $('#table4').hide()
    if (!item) return
    dataArray = item
    DataTable.Buttons.defaults.dom.button.className = 'btn';
    $(document).ready(function () {
      
      $('#datatablecommand').DataTable({
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"ip>',
        buttons: {
          buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fa fa-file-excel-o" style="font-size:20px ; background-color: #3ca23c"></i>',
            titleAttr: 'Excel'
          }
          // { extend: 'print'},
        ],
        dom: {
          button: {
               className: 'btn btn-success'
          },
          buttonLiner: {
               tag: null
          }
         }
    },
        data: item,
        columns: [
          {
            data: null,
            render: function (data, type, row, meta) {
                return "<button type='button' class='btn btn-success  btn-sm editBtn'><i class='bx bxs-user'></i></button>";
            }
          },
          { data: 0 },
          { data: 2 },
          { data: 3 },
          { data: 4 },
          { data: 5 },
          { data: 6 },
          { data: 7 },

          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[8] != '') {
                return "<a  href='" + (row[8]) + "'target='_blank' class='btn btn-primary  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[9] != '') {
                return "<a  href='" + (row[9]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[10] != '') {
                return "<a  href='" + (row[10]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
        ],
        destroy: true,    //ซ่อนคอลัม
        responsive: true,
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/th.json', },
        order: [[1, 'desc']],
        // columnDefs: [
        //         {targets: [0,1,3],className: 'all',},    
        //  ],
      });
    });

  }

 google.script.run.withSuccessHandler(dataTableAnnounce).searchData('ประกาศ')
  var dataArray
  function dataTableAnnounce(item) {
    $('#table5').hide()
    if (!item) return
    dataArray = item
    DataTable.Buttons.defaults.dom.button.className = 'btn';
    $(document).ready(function () {
      $('#datatableannounce').DataTable({
          dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"ip>',
         buttons: {
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fa fa-file-excel-o" style="font-size:20px ; background-color: #3ca23c"></i>',
            titleAttr: 'Excel'
          }
          // { extend: 'print'},
        ],
        dom: {
          button: {
               className: 'btn btn-success'
          },
          buttonLiner: {
               tag: null
          }
         }
    },
        data: item,
        columns: [
          {
            data: null,
            render: function (data, type, row, meta) {
                return "<button type='button' class='btn btn-success  btn-sm editBtn'><i class='bx bxs-user'></i></button>";
            }
          },
          { data: 0 },
          { data: 2 },
          { data: 3 },
          { data: 4 },
          { data: 5 },
          { data: 6 },
          { data: 7 },
          // {
          //   data: null,
          //   render: function (data, type, row, meta) {
          //     if (row[7] != '') {
          //       return "<a  href='" + (row[7]) + "'target='_blank' class='btn btn-primary btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
          //     } else {
          //       return "";
          //     }
          //   }
          // },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[8] != '') {
                return "<a  href='" + (row[8]) + "'target='_blank' class='btn btn-primary  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[9] != '') {
                return "<a  href='" + (row[9]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[10] != '') {
                return "<a  href='" + (row[10]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
        ],
        destroy: true,    //ซ่อนคอลัม
        responsive: true,
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/th.json', },
        order: [[1, 'desc']],
        // columnDefs: [
        //         {targets: [0,1,3],className: 'all',},    
        //  ],
      });
    });

  }


// ดึงข้อมูลจากชีตบันทึก
  let dataSend2

  google.script.run.withSuccessHandler((result) => {
    dataSend2 = result
  }).searchData('บันทึก')

  //โหลดข้อมูลจากชีตหนังสือบันทึกข้อความ แสดงในตาราง datatable
 // google.script.run.withSuccessHandler(datatablerecord).searchData('บันทึก')

  var dataArray

  function searchDataS2(item) {
    var table = $('#datatablepost').DataTable();
    DataTable.Buttons.defaults.dom.button.className = 'btn';
    $('#table6').hide()
    if (!item) return
    dataArray = item
    $(document).ready(function () {
      $('#datatablerecord').DataTable({
        //  dom: 'Bfrtip',
        dom: '<"d-flex justify-content-between"Bf>rt<"d-flex justify-content-between"ip>',
         buttons: {
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fa fa-file-excel-o" style="font-size:20px ; background-color: #3ca23c"></i>',
            titleAttr: 'Excel'
          }
          // { extend: 'print'},
        ],
        dom: {
          button: {
               className: 'btn btn-success'
          },
          buttonLiner: {
               tag: null
          }
         }
    },
        data: item,
        columns: [
          {
            data: null,
            render: function (data, type, row, meta) {
                return "<button type='button' class='btn btn-info  btn-sm editBtn'><i class='bx bxs-user'></i></button>";
            }
          },
          { data: 0 },
          { data: 2 },
          { data: 3 },
          { data: 4 },
          { data: 5 },
          { data: 6 },
          { data: 7 },
          { data: 8 },
          { data: 9 },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[10] != '') {
                return "<a  href='" + (row[10]) + "'target='_blank' class='btn btn-primary  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[11] != '') {
                return "<a  href='" + (row[11]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
          {
            data: null,
            render: function (data, type, row, meta) {
              if (row[12] != '') {
                return "<a  href='" + (row[12]) + "'target='_blank' class='btn btn-danger  btn-sm editBtn' ><i class='bx bxs-file'></i></a>";
              } else {
                return "";
              }
            }
          },
        ],
        destroy: true,    //ซ่อนคอลัม
        responsive: true,
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/th.json', },
        order: [[1, 'desc']],
        // columnDefs: [
        //         {targets: [0,1,3],className: 'all',},    
        //  ],
      });
    });

  }
