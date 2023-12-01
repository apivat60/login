    let id

//ซ่อนฟอร์ม
$("#form").addClass('d-none') 

//เคลียร์ข้อมูลในฟอร์ม ถ้าปิด Modal
$('#exampleModal').on('hidden.bs.modal', function (e) {
$('#input0').html('');
$('#input0').append(`<option selected disabled value="" >เลือก</option>`);
})

//บันทึกข้อมูลลงชีต
function saveData(obj){ 
$("#uid").val(id)
event.preventDefault()
  Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
  Swal.showLoading();
  google.script.run.withSuccessHandler(()=>{
    Swal.close()
    Swal.fire('บันทึกข้อมูลเรียบร้อยแล้ว')
    document.getElementById('myform').reset()
    $('#btnCloseModal').click()
    
  }).addRecord(obj)
}


//เปิดชีตที่เลือก แล้วไปดึงรายการวัสดุในชีตชื่อ setting มาทำตัวเลือกในดรอบดาวน์
function openSheet(){
  
  id = $("#sheetID").val()
     Swal.fire({ title: 'รอสักครู่..' });
     Swal.showLoading();

google.script.run.withSuccessHandler((data)=>{

  Swal.close();
  $("#form").removeClass('d-none')
  $('#btnOpenModal').click()
  let item = document.getElementById("input0");
     data.forEach(r=>{
       option = document.createElement("option") ;
       option.textContent = r[0];
       item.appendChild(option);
    })
   }).getOptions(id); 

}
