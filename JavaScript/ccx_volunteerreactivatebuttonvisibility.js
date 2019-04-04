function Control() {
    var Entity = Xrm.Page.data.entity.getEntityName();
    var Result = false;
    //alert("Entity False = " + Entity);

    if (Entity == 'ccx_volunteer') {
        var VolunteerStatus = Xrm.Page.data.entity.attributes.get("ccx_volunteerstatus").getValue();
       
        if (VolunteerStatus == 7 || VolunteerStatus == 8 || VolunteerStatus == 9) {
            Result = true;
        }
    }

    //alert("Result = " + Result);
    return Result
}


