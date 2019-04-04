function RoleGridControl() {
    var Entity = Xrm.Page.data.entity.getEntityName();
    var Result = true;
    //alert("Entity False = " + Entity);

    if (Entity == 'ccx_volunteer_bulk_activity') {
        var BulkActivityCompleate = Xrm.Page.getAttribute("ccx_volunteerbulkactivitycompleate").getValue();
        if (BulkActivityCompleate == true) {
            Result = false;
        }        
    }

    if (Entity == 'ccx_volunteer') {
        var VolunteerStatus = Xrm.Page.data.entity.attributes.get("ccx_volunteerstatus").getValue();
        var AgeBit = Xrm.Page.getAttribute("ccx_agebit").getValue();        
        if (AgeBit == false || VolunteerStatus == 1 || VolunteerStatus == 2 || VolunteerStatus == 7 || VolunteerStatus == 8 || VolunteerStatus == 9) {
            Result = false;
        }
    }

    if (Entity == 'ccx_csservicelog') {
        var ServiceLogCompleate = Xrm.Page.getAttribute("ccx_servicelogcomplete").getValue();
        if (ServiceLogCompleate == true) {
            Result = false;
        }
    }

    //alert("Result = " + Result);
    return Result
}


