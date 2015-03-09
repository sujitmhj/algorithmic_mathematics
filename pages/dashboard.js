$.getJSON("../syllabus.json", function(json) {
    syllabus = json; // this will show the info it in firebug console
    $("#side-menu").append(get_menu_html()); 
    $('#side-menu').metisMenu();
});
function get_func_val(fx, values)
{
  
    for (key in values) {
        if (values.hasOwnProperty(key)) {
            fx = fx.replace(new RegExp(key, 'g'),values[key]);
        }
    }  
    return eval(fx);
}
function get_input(form_id)
{
    var inputs = $("#"+form_id+" input");
    var form_data = {};
    for(var i=0;i<inputs.length;i++)
    {
        var input = $(inputs[i]);
        var input_name = input.attr("name");
        var input_type = input.attr("data-type");
        var input_value = input.val();
        if(input_type == "float")
        {
            processed_value = parseFloat(input_value);
        }
        else if(input_type == "int")
        {
            processed_value = parseInt(input_value);
        }
        else
        {
            processed_value = input_value;
        }
        form_data[input_name] = processed_value;
    }
    return form_data;
}
function get_menu_html()
{

    var chapters = syllabus.chapters;
    var html_str = "";
    for(var i = 0; i < chapters.length; i++)
    {
        var name = chapters[i].name;
        var topics = chapters[i].topics;

        html_str += "<li>";
        html_str += '<a href="#">#'+(i+1) +". "+name+'<span class="fa arrow"></span></a>';
        if(topics!=undefined && topics.length>0)
        {
            html_str += '<ul class="nav nav-second-level">';
            for(var j = 0;j<topics.length;j++)
            {
                html_str += '<li>';
                html_str += '<a href="#" class="topics_link" data-chapter="'+i+'" data-topic="'+j+'">'+topics[j]+'</a>';
                html_str += '</li>';
            }
            html_str += '</ul>';

        }
        
        html_str += "</li>";
    }
    return html_str;
}
                
$("#side-menu").on("click",".topics_link",function(){
var chapter_id = $(this).attr("data-chapter");
var topic_id = $(this).attr("data-topic");
var chapter_name = syllabus.chapters[chapter_id].name;
var topic_name = syllabus.chapters[chapter_id].topics[topic_id];
var code_demo = '<div class="btn-group pull-right" role="group" aria-label="...">';
  code_demo += '<button type="button"  class="btn btn-default code_demo" data-action="code">Code</button>';
  code_demo += '<button type="button" class="btn btn-default btn-success code_demo" data-action="demo">Demo</button>';
code_demo += '</div>';
$("#index_content").hide();
$("#page_title").html(topic_name+code_demo);
$.get("chapter"+(parseInt(chapter_id)+1)+"/"+String.fromCharCode(97+parseInt(topic_id))+".html", function(html_content) {
    current_html = html_content;
    $("#content_area").html(current_html);
}).fail(function() {
    $("#content_area").html("This topic is still under construction. Please contribute :)");
  });
});

$("#page_title").on("click",".code_demo",function(){
$(".code_demo").removeClass("btn-success");
$(this).addClass("btn-success");
var action = $(this).attr("data-action");
if(action == "code")
{
    var safe_html = $('<div/>').text(current_html).html();

    $("#content_area").html("<textarea class='col-lg-12' rows='22' disabled>"+safe_html+"</textarea>");
}
else
{
     $("#content_area").html(current_html);
}
});