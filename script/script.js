var array = [];


$(document).ready(function(){
        $(".add-row").click(function(){
            var data = {
                        
                        name : $("#name").val(),
                        adresse : $("#Adresse").val(),
                        phone : $("#Phone").val(),
                        FrameType : $("#Frame-Type").val(),
                        FrameColour : $("#Frame-Colour").val(),
                        keyboardType : $("#keyboard-type").val(),
                        KeyboardColour : $("#Keyboard-Colour").val(),
                        ScreenType : $("#Screen-Type").val(),
                        ScreenColour : $("#Screen-Colour").val(),
                        quantity : $("#quantity").val(),
                }


            var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + data.name + 
            "</td><td>" + data.FrameType + 
            "</td><td>" + data.FrameColour + 
            "</td><td>" + data.keyboardType + 
            "</td><td>" + data.KeyboardColour + 
            "</td><td>" + data.ScreenType + 
            "</td><td>" + data.ScreenColour + 
            "</td><td>" + data.quantity + 
            "</td></tr>";
            
             
             
             array.push(data);

             

             if ($("#name").val()!="" && $("#Adresse").val()!="" && $("#Phone").val()!="") {
                    $("table tbody").append(markup);
                    $("#name").val("");
                    $("#Adresse").val("");
                    $("#Phone").val("");
             }
             else { alert("Please Fill All required inputs") }

            



        });

        $(".send-server").click (function(){

                $.ajax({
                    type: "POST",
                    url: "/submit",
                    data: {data : array },
                    success: function(){
                        alert("data sent");
                    },
                    // dataType: dataType  
                });

                console.log(array)               
                

        })
        
        // Find and remove selected table rows
        $(".delete-row").click(function(){
            $("table tbody").find('input[name="record"]').each(function(i){
            	if($(this).is(":checked")){
                    $(this).parents("tr").remove();
                    array[i].deleted = true;
                }
           });

           array = array.filter( function(data, i){
                return !data.deleted;

           })


        });
    }); 