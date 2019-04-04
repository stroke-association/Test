function OnLoad() {

    VolActivityLookup();

/* added by CJSH 04/12/2018 */
    var FormType = Xrm.Page.ui.getFormType();
    var Volunteer = Xrm.Page.getAttribute("ccx_volunteer_id").getValue();
   
        if (FormType == 1 && Volunteer== null) {
            alert("Please Note: You can only add an Activity from a Volunteer or Volunteer Role \nThis form will now close");
            Xrm.Page.ui.close();
        }

} // End On Load

function OnSave() {
    Xrm.Page.ui.clearFormNotification("1");
    CreateForm = 1;
    EditForm = 2;
    if (Xrm.Page.ui.getFormType() == CreateForm || Xrm.Page.ui.getFormType() == EditForm) {
        if (Xrm.Page.getAttribute("ccx_activitycodelookup").getValue() != null) {
            Xrm.Page.getAttribute("ccx_name").setValue(Xrm.Page.getAttribute("ccx_activitycodelookup").getValue()[0].name.substring(0, 150));
            Xrm.Page.getAttribute("ccx_name").setSubmitMode("always");
        }
    }
}

function VolActivityLookup() {

    var Role = Xrm.Page.getAttribute("ccx_volunteerroleid").getValue();
    var FromVolunteer = false;
    var FromRole = false;

    if (Role == null) {
        //    alert ("Training = true");
        FromVolunteer = true;
    }
    if (Role != null) {
        //    alert ("Training = true");
        FromRole = true;
    }

    if (FromRole == true) {
        // alert("fromRole");

        var CheckStatus = Xrm.Page.getAttribute("ccx_checkstatus").getValue(); // 1= NA, 2 = Required - Requested, 3 = Required - Supervised Alowed, 4 = Required - Valid, 5 = Required - Not Valid 
        var TrainingStatus = Xrm.Page.getAttribute("ccx_mandatorytrainingstatus").getValue(); // 1 = NA, 2 Required - Not compleated, 3 = Required - Supervised Alowed, 4 = Required - Compleated
        var ReferencesStatus = Xrm.Page.getAttribute("ccx_referencesstatus").getValue();  // 1 = NA, 2 = Required - Valid, 3 = Required - Not Valid
        var DrivingStatus = Xrm.Page.getAttribute("ccx_drivingstatus").getValue(); // 1 = NA, 4 = Required - Valid, 5 = Required - Not Valid
        var Service = Xrm.Page.getAttribute("ccx_cs_serviceid").getValue(); // 1 = Optional, 2 = Mandatory, 3 = Restricted
        var ClubandGroup = Xrm.Page.getAttribute("ccx_strokeclubandgroup").getValue(); // 1 = Optional, 2 = Mandatory, 3 = Restricted

        //alert("CheckStatus = " + CheckStatus + "\nTrainingStatus = " + TrainingStatus + "\nReferencesStatus = " + ReferencesStatus + "\nDrivingStatus = " + DrivingStatus + "\nService = " + Service + "\nClubandGroup = " + ClubandGroup);        

        defaultViewId = Xrm.Page.getControl("ccx_activitycodelookup").getDefaultView();
        var viewId = "{1DFB2B35-B07C-44D1-868D-258DEEAB88E2}";
        var entityName = "ccx_volunteeractivityadmin";
        var viewDisplayName = "Relevant activity codes";
        var RoleXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "<entity name='ccx_volunteeractivityadmin'>" +
        "<attribute name='ccx_volunteeractivityadminid' />" +
        "<attribute name='ccx_name' />" +
        "<attribute name='ccx_glossary' />" +
        "<order attribute='ccx_name' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='statecode' operator='eq' value='0' />" +
        "<condition attribute='ccx_training' operator='eq' value='0' />" +
		"<condition attribute='ccx_legacyonly' operator='eq' value='0' />"; //legacy

        if (CheckStatus == 1 || CheckStatus == 2 || CheckStatus == 5) {
            //alert("CheckStatus = 1 2 5");
            RoleXml +=
            "<condition attribute='ccx_checksrequired' operator='eq' value='0' />";
        }
        if (CheckStatus == 3) {
            //alert("CheckStatus = 3");
            RoleXml +=
            "<condition attribute='ccx_checksrequired' operator='eq' value='1' />" +
            "<condition attribute='ccx_supervised_activity' operator='eq' value='1' />";
        }
        if (CheckStatus == 4) {
            // alert("CheckStatus = 4");
            RoleXml +=
           "<condition attribute='ccx_checksrequired' operator='eq' value='1' />";
        }

        if (TrainingStatus == 3) {
            //alert("TrainingStatus = 3");
            RoleXml +=
            "<condition attribute='ccx_trainingsupervisedactivityallowed' operator='eq' value='1' />";
        }

        if (DrivingStatus != 4) {
            // alert("DrivingStatus != 4");
            RoleXml +=
            "<condition attribute='ccx_drivingactivity' operator='eq' value='0' />";
        }

        if (Service != null) {
            // alert("Service != null");
            RoleXml +=
            "<condition attribute='ccx_service' operator='ne' value='3' />";
        }


        if (Service == null) {
            // alert("Service == null");
            RoleXml +=
            "<condition attribute='ccx_service' operator='ne' value='2' />";
        }

        if (ClubandGroup != null) {
            // alert("ClubandGroup != null");
            RoleXml +=
            "<condition attribute='ccx_strokeclubandgroup' operator='ne' value='3' />";
        }


        if (ClubandGroup == null) {
            // alert("ClubandGroup == null");
            RoleXml +=
            "<condition attribute='ccx_strokeclubandgroup' operator='ne' value='2' />";
        }

        RoleXml +=
           "</filter>" +
           "</entity>" +
           "</fetch>";
        var VollayoutXml = "<grid name='resultset' object='1' jump='ccx_volunteeractivityadminid' " +
        "select='1' icon='1' preview='1'> <row name='result' id='ccx_volunteeractivityadminid'>" +
        "<cell name='ccx_name' width='300' />" +
        " </row> </grid>";
        Xrm.Page.getControl("ccx_activitycodelookup").addCustomView(viewId, entityName, viewDisplayName, RoleXml, VollayoutXml, true);
        /*Xrm.Page.getControl("ccx_activitycodelookup").getCustomView(defaultViewId).setVisible(false);*/
    }
    // Create View Volunteer 

    if (FromVolunteer == true) {
        // alert("fromVolunteer");
        defaultViewId = Xrm.Page.getControl("ccx_activitycodelookup").getDefaultView();
        var viewId = "{1DFB2B35-B07C-44D1-868D-258DEEAB88E2}";
        var entityName = "ccx_volunteeractivityadmin";
        var viewDisplayName = "Relevant activity codes";
        var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "<entity name='ccx_volunteeractivityadmin'>" +
        "<attribute name='ccx_volunteeractivityadminid' />" +
        "<attribute name='ccx_name' />" +
        "<order attribute='ccx_name' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='statecode' operator='eq' value='0' />" +
        "<condition attribute='ccx_training' operator='eq' value='1' />" +
        "</filter>" +
        "</entity>" +
        "</fetch>";
        var layoutXml = "<grid name='resultset' object='1' jump='ccx_volunteeractivityadminid' " +
        "select='1' icon='1' preview='1'> <row name='result' id='ccx_volunteeractivityadminid'>" +
        "<cell name='ccx_name' width='300' />" +
        " </row> </grid>";
        Xrm.Page.getControl("ccx_activitycodelookup").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
        /*Xrm.Page.getControl("ccx_activitycodelookup").getCustomView(defaultViewId).setVisible(false);*/
    }
}  // End Vol Activity Lookup



function DateCheck(Trigger) {
    //alert("DateCheck");
    Xrm.Page.ui.clearFormNotification("1");
    if (Trigger == 'OnChange') {
        var Today = new Date();
        var ActivityDate = Xrm.Page.getAttribute("ccx_activity_date").getValue();
        if (ActivityDate > Today) {
            //  alert("You Can not select an activity date in the future\nPlease Select a Valid Date");
            Xrm.Page.data.entity.attributes.get("ccx_activity_date").setValue(null);
            Xrm.Page.ui.setFormNotification("You Can not select an activity date in the future\nPlease Select a Valid Date", "ERROR", "1");
        }
    }
}