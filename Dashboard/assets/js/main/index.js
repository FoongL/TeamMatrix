// chatrs js starts from here
$(document).ready(function () {

    var ctx1 = $("#pie-chartcanvas-1");



    var data1 = {
        labels: ["New Project", "On Progress", "Completed", "Over Due" ],
        datasets: [{
            label: "Task Completion",
            data: [10, 50, 25, 15 ],
            backgroundColor: [
                "#54DEFD",
                "#F7C007",
                "#134611",
                "#A60E01",
                
            ],
            borderColor: [
                "#54DEFD",
                "#F7C007",
                "#134611",
                "#A60E01",
                
            ],
            borderWidth: [1, 1, 1, 1 ]
        }]
    };

    var options = {
        title: {
            display: false,
            position: "top",
            text: "TASK OVERVIEW",
            fontSize: 18,
            fontColor: "#000000"
        },
        legends: {
            display: true,
            position: "bottom"
        }
    };



    var chart1 = new Chart(ctx1, {
        type: "doughnut",
        data: data1,
        ticks: {
            mirror: true,
            fontSize:16,
            padding:-10,
        },
        options: options
    });
})

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Foong', 'Douglas', 'Sam', 'Subash'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                "#54DEFD",
                "#009FFD",
                "#84A9C0",
                "#5F5AA2",
                


            ],
            borderColor: [
                "#54DEFD",
                "#009FFD",
                "#84A9C0",
                "#5F5AA2",
            ],
            borderWidth: 3
        }]
    },



    options: {

        title: {
            display: true,
            position: "top",
            text: "NEW TASK",
        
            fontSize: 18,
            fontColor: "#000000"

        },

        legend:{
            display: false
        },
        tooltips: {
            callbacks:{
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                }
            }],
            ticks: {
                beginAtZero: true
                
            }
        }
    }
});



var ctx = document.getElementById('myChart-1').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Foong', 'Douglas', 'Sam', 'Subash'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                "#F7C007",
                "#FDE74C",
                "#FFE74C",
                "#E4B363",
            ],
            borderColor: [
                "#F7C007",
                "#FDE74C",
                "#FFE74C",
                "#E4B363",

            ],
            borderWidth: 3
        }]
    },
    options: {
        title: {
            display: true,
            position: "top",
            text: "ON PROGRESS",
            fontSize: 18,
            fontColor: "#000000"
        },

        legend:{
            display: false
        },
        tooltips: {
            callbacks:{
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        },

        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                }
            }],
            ticks: {
                beginAtZero: true
            }
        }
    }
});

var ctx = document.getElementById('myChart-2').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Foong', 'Douglas', 'Sam', 'Subash'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                "#134611",
                "#688E26",
                "#3DA35D",
                "#96E072",

            ],
            borderColor: [
                "#134611",
                "#688E26",
                "#3DA35D",
                "#96E072",

            ],
            borderWidth: 3
        }]
    },
    options: {
        title: {
            display: true,
            position: "top",
            text: "COMPLETED",
            fontSize: 18,
            fontColor: "#000000"
        },

        legend:{
            display: false
        },
        tooltips: {
            callbacks:{
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        },

        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                }
            }],
            ticks: {
                beginAtZero: true
            }
        }
    }
});

var ctx = document.getElementById('myChart-3').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Foong', 'Douglas', 'Sam', 'Subash'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                "#A60E01",
                "#DB222A",
                "#C41E3D",
                "#DD2D4A",
               

            ],
            borderColor: [
                "#A60E01",
                "#DB222A",
                "#C41E3D",
                "#DD2D4A",

            ],
            borderWidth: 3
        }]
    },
    options: {
        title: {
            display: true,
            position: "top",
            text: "OVERDUE TASK",
            fontSize: 18,
            fontColor: "#000000"
        },

        legend:{
            display: false
        },
        tooltips: {
            callbacks:{
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        },
          
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                }
            }],
            ticks: {
                beginAtZero: true
            }
        }
    }
});

// NightMode Js Starts Here
var options = {
    bottom: '64px', // default: '32px'
    right: 'unset', // default: '32px'
    left: '16px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#fff', // default: '#fff'
    backgroundColor: '#fff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: false, // default: true,
    label: "🌓", // default: ''
    autoMatchOsTheme: true // default: true
  }
  
  const darkmode = new Darkmode(options);
  darkmode.showWidget();





