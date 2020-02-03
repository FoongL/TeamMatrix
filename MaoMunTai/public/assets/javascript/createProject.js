let NewUserList = '';
let projectTeamList = new Set();

$(document).ready(function(event) {
  $('#createProjName').val('');
  $('#createProjDue').val('');
  $('#team').val('');

  $.ajax({
    url: `/api/projects/listallusers`,
    type: 'POST',
    success: function(result) {
      console.log('data ready!');
      NewUserList = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
});

$('#team').on('input', function(event) {
  let searchText = $('#team').val();
  let matches = NewUserList.filter(user => {
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
  //console.log(matches);
  teamOutput(matches);
});

const teamOutput = async matches => {
  if ($('#team').val().length === 0) {
    $('.match-members').empty();
  }
  if (matches.length > 0) {
    const output = await matches
      .map(
        match => `
          <div id='${match.id}'>
          <a class='clickable' name='${match.f_name} ${match.l_name}' id='${match.id}'>${match.f_name} ${match.l_name} (${match.email})</a>
          </div>
          `
      )
      .join('');
    $('.match-members').empty();
    $('.match-members').append(output);
  }
};

$('.match-members, .clickable').on('click', function(event) {
  if (event.target.name === undefined){
    return
  }
  if ((event.target.class !== 'match-members') || (event.target.name !== undefined)|| (event.target.class !== undefined)) {
    if (projectTeamList.has(event.target.id) === false) {
      let nameOutput = `<p class='memberList'>${event.target.name}</p>`;
      $('.show-members').append(nameOutput);
      projectTeamList.add(event.target.id);
    }
    //   console.log(typeof event.target.id)
    
    $('#team').val('');
    $('.match-members').empty();
  }
});

$('#addProject').on('click', async function(event) {
  event.preventDefault();
  let projectName = $('#createProjName').val();
  let projectDue = $('#createProjDue').val();
  let curTime = new Date();
  today = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
  if (projectName == '') {
    alert('Please input a name for your project!');
    return;
  }
  if (projectDue == '') {
    alert('Please select target due date for your project');
    return;
  }
  if (projectDue < today) {
    alert('Due dates can only be set for the future');
    return;
  }
  await $.ajax({
    url: `/api/projects/add`,
    type: 'POST',
    data: {
      name: `${projectName}`,
      dueDate: `${projectDue}`
    },
    success: function(result) {
      console.log('project created');
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  //-----------------------query back project ID

  let projectID = '';

  await $.ajax({
    url: `/api/projects/getid`,
    type: 'POST',
    data: {
      name: `${projectName}`,
      dueDate: `${projectDue}`
    },
    success: function(result) {
      projectID = result[0]['id'];
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
  let NewProjectTeamList = Array.from(projectTeamList);

  if (NewProjectTeamList.length > 0) {
    for (let x in NewProjectTeamList) {
      //console.log('User:', userList[x])
      await $.ajax({
        url: `/api/projects/adduser`,
        type: 'POST',
        data: {
          projectId: `${projectID}`,
          userId: `${NewProjectTeamList[x]}`
        },
        success: function(result) {
          console.log('added someone');
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
    }
  }

  window.location.href = `/project/${projectID}`;
});
