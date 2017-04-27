var array = [];


$(document).ready(function(){

        $('#Phone').keyup( function () { 
            this.value = this.value.replace(/[^0-9\.]/g,'');
        });

        $('input').keyup( function () { 
            if(this.value) {
                    $(this).removeClass('required');
                    $(this).removeClass('tooltip');
             }
        });
       



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
            
             
             if(data.name && data.adresse && data.phone) {
                array.push(data);
             }

             

             if ($("#name").val()!="" && $("#Adresse").val()!="" && $("#Phone").val()!="") {
                    $("table tbody").append(markup);
                    $("#name").val("");
                    $("#Adresse").val("");
                    $("#Phone").val("");
                    $("#name").attr("placeholder", "Enter your full name");      
                    $("#Adresse").attr("placeholder", "your Adresse Here");           
                    $("#Phone").attr("placeholder", "Your Phone Number"); 
             }
             else{
             
                     if ($("#name").val()==="") { $("#name").addClass('required'); 
                                                    $("#name").attr("placeholder", "Required field");    
                                                    $("#name").addClass('tooltip');                
                                                 }
                     if ($("#Adresse").val()==="") { $("#Adresse").addClass('required');   
                                                    $("#Adresse").attr("placeholder", "Required field");          
                                                    $("#Adresse").addClass('tooltip');                                                 
                                                 }
                     if ($("#Phone").val()==="") { $("#Phone").addClass('required');  
                                                    $("#Phone").attr("placeholder", "Required field");                
                                                     $("#Phone").addClass('tooltip'); 
                                                 }
             }    



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