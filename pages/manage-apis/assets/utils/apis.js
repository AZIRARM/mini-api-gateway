//Apis



$('#refreshAuthorizationId').on('click', function() {
   refreshSelect();
});
const refreshSelect =(() => {
 $("#selectApiId").empty().append('<option value="none"> Select api </option>');;
    $.ajax({
        url: './apis',
        headers: {
           'Authorization': $('#authorizationKeyId').val()
        },
        type: 'GET',
        success: function(apis) {
           apis.map(api=> {
               $("#selectApiId").append('<option value=\''+api+'\'>'+api+'</option>');
           });
        }
    });
});

$('#selectApiId').on('change', function() {
    selectApi(this.value);
});

const selectApi =((appSelected) => {
        if(appSelected !== 'none') {
            $('#buttonApiRemoveId').css('visibility', 'visible');
            $('#buttonApiAddId').css('visibility', 'hidden');
        } else {
            $('#buttonApiRemoveId').css('visibility', 'hidden');
            $('#buttonApiAddId').css('visibility', 'visible');
        }

         $.ajax({
                url: './apis/'+appSelected,
                headers: {
                   'Authorization': $('#authorizationKeyId').val()
                },
                type: 'GET',
                success: function(response) {
                    if(response && response !== null && response.length > 0) {
                        $('#ApiPanelId').css('visibility', 'visible');
                        $('#buttonApiSaveId').css('visibility', 'visible');

                        $("#isNewApi").val("false");
                        $("#apiName").val(response[0].apiName);
                        $("#apiNameOrigin").val(response[0].apiName);
                        $("#apiUrl").val(response[0].apiUrl);
                        $("#apiVersion").val(response[0].apiVersion);
                        $('#authenticationType option[value="'+response[0].authenticationType+'"]').prop('selected', true);
                        $("#authenticationSecret").val(response[0].authenticationSecret);
                        $("#apiDescription").val(response[0].apiDescription);
                    } else {
                        $('#ApiPanelId').css('visibility', 'hidden');
                        $('#buttonApiSaveId').css('visibility', 'hidden');
                    }

                    return;
                }
            });
         }
     );


$('#buttonApiSaveId').on('click', function() {
    let isNewApi = $('#isNewApi').val();
    let apiName = $("#apiName").val();
    let apiNameOrigin = $("#apiNameOrigin").val();
    let apiUrl = $("#apiUrl").val();
    let apiVersion = $("#apiVersion").val();
    let authenticationType = $("#authenticationType").find("option:selected").val();
    let authenticationSecret = $("#authenticationSecret").val();
    let apiDescription = $("#apiDescription").val();

    if(!apiName || apiName === null || apiName.trim() === '') {
        alert('Need Api name');
    }
    else if(!apiUrl || apiUrl === null || apiUrl.trim() === '') {
        alert('Need Api Url');
    }
    else if( isNewApi === 'false'){
        var body = {
            "apiName": apiName,
            "apiNameOrigin": apiNameOrigin,
            "apiUrl": apiUrl,
            "apiVersion": apiVersion,
            "authenticationType": authenticationType,
            "authenticationSecret": authenticationSecret,
            "apiDescription": apiDescription
        };
       $.ajax({
            url: './apis/'+apiNameOrigin,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'PUT',
            headers: {
               'Authorization': $('#authorizationKeyId').val()
            },
            data: JSON.stringify(body),
            success: function(api) {
                alert("Api : "+api+", successfully updated");
                refreshSelect();
                selectApi('none');
                return;
            }
        });
    } else {

        var body = {
            "apiName": apiName,
            "apiNameOrigin": apiNameOrigin,
            "apiUrl": apiUrl,
            "apiVersion": apiVersion,
            "authenticationType": authenticationType,
            "authenticationSecret": authenticationSecret,
            "apiDescription": apiDescription
        };
       $.ajax({
            url: './apis/',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
               'Authorization': $('#authorizationKeyId').val()
            },
            data: JSON.stringify(body),
            success: function(api) {
                alert("Api : "+api+", successfully added");
                $('#selectApiId').append('<option value="'+api+'">'+api+' </option>');

                return;
            }
        });
    }
});
$('#buttonApiRemoveId').on('click', function() {
    var selectedApi = $('#selectApiId').find("option:selected").val();
    if( ( selectedApi && selectedApi !== null && selectedApi !== 'none' ) ){
        if ( confirm("Remove Api: "+selectedApi+" ? ") ) {
            $.ajax({
                    url: './apis/'+selectedApi,
                    headers: {
                       'Authorization': $('#authorizationKeyId').val()
                    },
                    type: 'DELETE',
                    success: function(api) {
                        alert("Api : "+selectedApi+", Removed successfully");
                        $("#selectApiId option[value='"+selectedApi+"']").remove();


                        $("#selectApiId option[value='"+api+"']").remove();


                        $('#ApiPanelId').css('visibility', 'hidden');
                        $('#buttonApiSaveId').css('visibility', 'hidden');

                        $("#isNewApi").val("false");
                        $("#apiName").val("");
                        $("#apiNameOrigin").val("");
                        $("#apiUrl").val("");
                        $("#apiVersion").val("");
                        $("#authenticationSecret").val("");
                        $("#apiDescription").val("");

                        return;
                    }
                });
        }
    } else {
        alert("To remove Environment from configuration you need to select environment");
    }
});


$('#buttonApiAddId').on('click', function() {
    $('#ApiPanelId').css('visibility', 'visible');
    $('#buttonApiSaveId').css('visibility', 'visible');

    $("#isNewApi").val("true");
    $("#apiName").val("");
    $("#apiNameOrigin").val("");
    $("#apiUrl").val("");
    $("#apiVersion").val("");
    $("#authenticationSecret").val("");
    $("#apiDescription").val("");
});
