const addTaskButton = $('#addTaskButton');
const search = $('#userSearch');
const searchOutput = $('#nameList');
const hiddenID = $('.secretIDHolder').attr('id');
let userList = '';
let taskAssignList = new Set();
let subTaskList = [];

//--- query for users in the project when "add task" is clicked
addTaskButton.on('click', function() {
  subTaskList = [];
  taskAssignList = new Set();
  $('#inTheProject').empty();
  $('#subButt').empty();
  $.ajax({
    url: `/api/projects/getusers`,
    type: 'POST',
    data: { projectId: `${hiddenID}` },
    success: function(result) {
      userList = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
});

// search function based on who's in it (using REGEX to find matches)
search.on('input', function() {
  let searchText = search.val();

  let matches = userList.filter(user => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return (
      user.f_name.match(regex) ||
      user.l_name.match(regex) ||
      user.email.match(regex)
    );
  });
  if (searchText.length === 0) {
    matches = [];
  }
  //console.log(matches)
  outputHTML(matches);
});
// appending results to HTML in order to know who matches what is typed

const outputHTML = async matches => {
  if (search.val().length === 0) {
    $('#nameList').empty();
  }
  if (matches.length > 0) {
    const output = await matches
      .map(
        match => `
        <div>
        <a class='clickable' name='${match.f_name} ${match.l_name}' id='${match.id}'>${match.f_name} ${match.l_name} (${match.email})</a>
        </div>
        `
      )
      .join('');
    $('#nameList').empty();
    $('#nameList').append(output);
  }
};

// clicking and selecting users to add to the projects
$('#nameList,.clickable').on('click', function(event) {
  if (event.target.id !== 'nameList' || event.target.name !== undefined) {
    if (taskAssignList.has(event.target.id) === false) {
      let nameOutput = `<p class='memberList'>${event.target.name}</p>`;
      $('#inTheProject').append(nameOutput);
    }
    //   console.log(typeof event.target.id)
    taskAssignList.add(event.target.id);
    //console.log(taskAssignList);
    search.val('');
    $('#nameList').empty();
  }
});
//-----saving subtasks
$('#subSave').on('click', function(event) {
  subtaskName = $('#subtaskName').val();
  subtaskDue = $('#subtaskDue').val();
  let curTime = new Date();
  today = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
  if (subtaskName == '') {
    alert('Please insert Subtask Name');
    return;
  }
  if (subtaskDue == '') {
    alert('Please insert a due date');
    return;
  }
  if (subtaskDue < today) {
    alert('Due dates can only be set for the future.');
    return;
  }

  let saveSubtask = { name: `${subtaskName}`, due_date: `${subtaskDue}` };
  subTaskList.push({ saveSubtask });
  //console.log(subTaskList);
  $('#subtaskName').val('');
  $('#subtaskDue').val('');
  if (subTaskList.length == 1) {
    $('#subButt').html(`<p>${subTaskList.length} Subtask saved.</p>`);
  } else {
    $('#subButt').html(`<p>${subTaskList.length} Subtasks saved.</p>`);
  }
});

// ------ adding tasks

$('#taskSave').on('click', async function(event) {
  taskName = $('#taskName').val();
  taskDesc = $('#taskDesc').val();
  taskDue = $('#taskDue').val();
  let userList = Array.from(taskAssignList);

  //----- input validation
  let curTime = new Date();
  today = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
  if (taskName == '') {
    alert('Please input a name for your task');
    return;
  }
  if (taskDesc == '') {
    alert('Please input a small description for your task');
    return;
  }
  if (taskDue == '') {
    alert('Please select target due date for your task');
    return;
  }
  if (taskDue < today) {
    alert('Due dates can only be set for the future.');
    return;
  }

  if (userList.length ==0){
    alert('Must have at least one person assigned to task to initiate!');
    return;
  }

  //----- FIRST CREATE THE TASK!
  await $.ajax({
    url: `/api/tasks/add`,
    type: 'POST',
    data: {
      projectID: `${hiddenID}`,
      name: `${taskName}`,
      desc: `${taskDesc}`,
      dueDate: `${taskDue}`
    },
    success: function(result) {
      //location.reload()
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  //------ Query back task ID

  let taskID = '';

  await $.ajax({
    url: `/api/tasks/getid`,
    type: 'POST',
    data: {
      dueDate: `${taskDue}`
    },
    success: function(result) {
      taskID = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  //console.log('task id:',taskID[0]['id'])

  for (let x in userList) {
    //console.log('User:', userList[x])
    await $.ajax({
      url: `/api/tasks/adduser`,
      type: 'PUT',
      data: {
        tasksID: `${taskID[0]['id']}`,
        user: `${userList[x]}`
      },
      success: function(result) {
        return;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
  }
  for (let y in subTaskList) {
    console.log(subTaskList[y]['saveSubtask']['name']);
    console.log(subTaskList[y]['saveSubtask']['due_date']);
    await $.ajax({
      url: `/api/subtasks/add`,
      type: 'POST',
      data: {
        taskID: `${taskID[0]['id']}`,
        name: `${subTaskList[y]['saveSubtask']['name']}`,
        dueDate: `${subTaskList[y]['saveSubtask']['due_date']}`
      },
      success: function(result) {
        return;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
  }

  location.reload();
});
