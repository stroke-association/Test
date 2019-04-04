function AwardsGridControl() {
    var Entity = Xrm.Page.data.entity.getEntityName();
    var Result = true;
    //alert("Entity False = " + Entity);

    if (Entity == 'ccx_volunteer') {
        var VolunteerStatus = Xrm.Page.data.entity.attributes.get("ccx_volunteerstatus").getValue();
        var AgeBit = Xrm.Page.getAttribute("ccx_agebit").getValue();
        if (AgeBit == false || VolunteerStatus == 1 ||  VolunteerStatus == 2 ||  VolunteerStatus == 7 || VolunteerStatus == 8 || VolunteerStatus == 9) {
            Result = false;
        }
    }

    //alert("Result = " + Result);
    return Result
}