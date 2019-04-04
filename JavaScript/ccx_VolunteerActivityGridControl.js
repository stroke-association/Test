function ActivityGridControl() {
    var Entity = Xrm.Page.data.entity.getEntityName();
    var Result = false;
    //alert("Entity False = " + Entity);

    if (Entity == 'ccx_volunteer_bulk_activity') {
        Result = false;      
    }

    if (Entity == 'ccx_volunteer') {
        Result = true;
        var VolunteerStatus = Xrm.Page.data.entity.attributes.get("ccx_volunteerstatus").getValue();
        var AgeBit = Xrm.Page.getAttribute("ccx_agebit").getValue();
        if (AgeBit == false || VolunteerStatus == 1 || VolunteerStatus == 2 || VolunteerStatus == 7 || VolunteerStatus == 8 || VolunteerStatus == 9) {
            Result = false;
        }
    }

    if (Entity == 'ccx_volunteer_role') {
        Result = true;
        var ActionControl = Xrm.Page.data.entity.attributes.get("ccx_activitycontrol").getValue();      
        if (ActionControl == false || ActionControl == null) {
            Result = false;
        }
    }



    //alert("Result = " + Result);
    return Result
}