$('#switch').on('click', function(event) {
  if ($(this).prop('checked') == true) {
    console.log('Checkbox is checked.');
  } else if ($(this).prop('checked') == false) {
    console.log('Checkbox is unchecked.');
  }
});

$('.assigned').on('click', async function(event) {
  var TaskId = $(event.target).attr('id');

  //--- data grab to populate the modal
  //--- variable names that will be populated by the api calls
  let subtasks;
  let taskMembers;
  let projectMembers;
  let taskDetails;
  //-- getting details about this specific task
  await $.ajax({
    url: `/api/tasks/getdetail`,
    type: 'POST',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
        //console.log(result)
        taskDetails = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
  //-- getting list of subtask (in order of due date)
  await $.ajax({
    url: `/api/subtasks/list`,
    type: 'POST',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
        //console.log(result)
      subtasks = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  //--- getting list of existing users that are assigned to the task (no order)
  await $.ajax({
    url: `/api/tasks/getusers`,
    type: 'POST',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
        //console.log(result)
        taskMembers = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
  
//---- Rendering out Task Detail information
taskName = taskDetails[0]['name']
taskDesc = taskDetails[0]['desc']
taskDue = taskDetails[0]['due_date']

console.log(taskName)
console.log(taskDesc)
console.log(taskDue)

$('#TaskTitle').html(`${taskName}`)
$('#TaskModalDescription').html(`${taskDesc}`)










});
