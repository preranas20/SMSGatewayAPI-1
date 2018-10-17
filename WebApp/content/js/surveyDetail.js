// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI

function AppViewModel() {
    var self= this;
    
    self.email=ko.observable('ak@a.com');
    self.password=ko.observable('a');
    self.urlIP=ko.observable('http://18.223.110.166:5000');
    
    self.newname=ko.observable('ankit');
    self.newemail=ko.observable('ak@a.com');
    self.newpassword=ko.observable('a');
    self.token=ko.observable('');
    self.adminName = ko.observable('Admin');

    self.login = function() {
      
    $.ajax({
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            email: self.email(),
            password:self.password() }),
            url: "http://18.223.110.166:5000/user/login",
           
            success: function(result) {
                //Write your code here
                if(result.status==200){
                //self.token(result.token);
                $.toast({ heading: 'Success',
                text: result.message,
                  showHideTransition: 'slide',
                icon: 'success'});
                $('#login').hide();
                self.getData();
                
                }
                else{
                    $.toast({heading:'error',text:result.message, icon: 'error'});
                }
                },
            error:
            function(result) {
                //Write your code here
                $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                }
        
      });
        // .done(function( data ) {
        //   alert( "welcome your token is = : " + data.token );
        // });

    }

     //make ajax call to api to get the data required to show the data tables.
        self.getData= function(params) {
            //on the success of ajax call showTable method by passing data
          
            self.showTable(data);
        }
  
    self.showUsers=function (params) {
    window.location="index.html";
    }
    self.getUserDetailSurvey =function (params) {
        //ajax to bring the user survey
        $.ajax({
            method: "POST",
            contentType: 'application/json',
            headers: {"Authorization": "BEARER "+readCookie('token')},
            data: JSON.stringify({
                _id: readCookie("uid"),
               surveyId: readCookie("sid") }),
                url: self.urlIP()+ "/user/profile/showsurvey",
               
                success: function(result) {
                    //Write your code here
                    if(result.status==200){
                    //self.token(result.token);
                //on success call 
$('#userDetail').fadeIn(2000);
function row(index,value,sid)
{
    this.question = Questions[index];
    this.answer = options[0][value];
    this.score=value;
    this.surveyId=sid;
}
var tableData=[];
var answerArray = result.user[0].answers;
//get data from result.user and generate the complete row wise data for each question and its respective answer from answer array
$.each(answerArray, function( index, value ) {
  tableData[index]= new row(index,value,result.user[0]._id);
  });
self.showUserDetailTable(tableData);
                    
                    }
                    else{
                        $.toast({heading:'error',text:result.message, icon: 'error'});
                    }
                    },
                error:
                function(result) {
                    //Write your code here
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                    }
            
          });
      
        

    }


self.showUserDetailTable= function (tabledata) {
    $('#usertable').fadeIn( 2000);
        var detailTable=$('#table_Detail').DataTable( {
            data: tabledata,
            dom: 'Bfrtip',
            columns: [
                { data: 'question', title:'Question' },
                { data: 'answer',title:'Answer' },
                { data: 'score',title:'Score' }
                
            ],
            buttons: [{
                extend: 'pdf',
                text: 'Print ',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            }
            ]
        } );
}

    

// self.hideUserForm= function(){
//     $('addUser').hide( "slow");
// }

//initialisation of the page goes here
self.getUserDetailSurvey();


//dummy data to be deleted later
var Questions = [
    "How often do you have a drink containing alcohol?",
    "How many drinks containing alcohol do you have on a typical day when you are drinking?",
    " How often do you have six or more drinks on one occasion?",
    " How often during the last year have you found that you were not able to stop drinking once you had started?"
    ,"How often during the last year have you failed to do what was normally expected from you because of drinking?"
    ," How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?"
    ," How often during the last year have you had a feeling of guilt or remorse after drinking?"
    ," How often during the last year have you been unable to remember what happened the night before because you had been drinking?"
    ,"Have you or someone else been injured as a result of your drinking?"
    ,"Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?"
]
var options = [
    [ "Never"
    ,"Monthly or less"
    ,"2 to 4 times a month"
    ,"2 to 3 times a week"
    ," 4 or more times a week" 
    ]
    ,[  "1 or 2"
        ,"3 or 4"
        ,"5 or 6"
        ," 7, 8, or 9"
        ," 10 or more"
    ]
    ,[ "Never"
        ," Less than monthly"
       ,"Monthly"
        ," Weekly"
       ," Daily or almost daily"

    ]
    ,[ "Never"
        ," Less than monthly"
       ,"Monthly"
        ," Weekly"
       ," Daily or almost daily"

    ]
    ,[ "Never"
        ," Less than monthly"
       ,"Monthly"
        ," Weekly"
       ," Daily or almost daily"

    ]
    ,[ "Never"
    ," Less than monthly"
   ,"Monthly"
    ," Weekly"
   ," Daily or almost daily"
    ]
    ,[ "Never"
        ," Less than monthly"
       ,"Monthly"
        ," Weekly"
       ," Daily or almost daily"

    ]
    ,[ "Never"
        ," Less than monthly"
       ,"Monthly"
        ," Weekly"
       ," Daily or almost daily"

    ]
    ,[ "No"
,"","Yes, but not in the last year"
,""," Yes, during the last year"

]
,[ "No"
,"","Yes, but not in the last year"
,""," Yes, during the last year"

]
];

var data = [
    {
        "name":       "Tiger Nixon",
        "position":   "System Architect",
        "salary":     "$3,120",
        "start_date": "2011/04/25",
        "office":     "Edinburgh",
        "extn":       "5421"
    },
    {
        "name":       "Garrett Winters",
        "position":   "Director",
        "salary":     "$5,300",
        "start_date": "2011/07/25",
        "office":     "Edinburgh",
        "extn":       "8422"
    }
];

}

ko.applyBindings(new AppViewModel());

 function createCookie(name, value, days) {
     window.localStorage.setItem(name,value);
//     var expires;

//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = "; expires=" + date.toGMTString();
//     } else {
//         expires = "";
//     }
//     document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    // var nameEQ = encodeURIComponent(name) + "=";
    // var ca = document.cookie.split(';');
    // for (var i = 0; i < ca.length; i++) {
    //     var c = ca[i];
    //     while (c.charAt(0) === ' ')
    //         c = c.substring(1, c.length);
    //     if (c.indexOf(nameEQ) === 0)
    //         return decodeURIComponent(c.substring(nameEQ.length, c.length));
    // }
    return window.localStorage.getItem(name);
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


// Activates knockout.js


